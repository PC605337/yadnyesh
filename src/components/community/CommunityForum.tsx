import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MessageCircle, Pin, Lock, Search, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { forumPostSchema } from "@/utils/validationSchemas";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  forum_id: string;
  is_anonymous: boolean;
  tags: string[];
  upvotes: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  author?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface Forum {
  id: string;
  name: string;
  description: string;
  category: string;
  post_count: number;
  member_count: number;
}

export const CommunityForum = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedForum, setSelectedForum] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchForums();
  }, []);

  useEffect(() => {
    if (selectedForum) {
      fetchPosts(selectedForum);
    }
  }, [selectedForum]);

  const fetchForums = async () => {
    try {
      const { data, error } = await supabase
        .from('community_forums')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;
      setForums(data || []);
      if (data && data.length > 0) {
        setSelectedForum(data[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load forums",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (forumId: string) => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles!forum_posts_author_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('forum_id', forumId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data as any) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    }
  };

  const createPost = async () => {
    // Validate input
    const validation = forumPostSchema.safeParse({
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      category: newPost.tags.trim()
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a post",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          forum_id: selectedForum,
          title: validation.data.title,
          content: validation.data.content,
          tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          author_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      setNewPost({ title: "", content: "", tags: "" });
      fetchPosts(selectedForum);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Community Forums</h1>
          <p className="text-muted-foreground">Connect with others and share experiences</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <Textarea
                placeholder="Share your thoughts..."
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
              <Input
                placeholder="Tags (comma separated)"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              />
              <Button onClick={createPost} className="w-full">
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedForum} onValueChange={setSelectedForum} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          {forums.slice(0, 4).map((forum) => (
            <TabsTrigger key={forum.id} value={forum.id} className="text-sm">
              {forum.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {forums.map((forum) => (
          <TabsContent key={forum.id} value={forum.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {forum.name}
                  <Badge variant="secondary">{forum.post_count} posts</Badge>
                </CardTitle>
                <CardDescription>{forum.description}</CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author?.avatar_url} />
                          <AvatarFallback>
                            {post.is_anonymous ? "A" : `${post.author?.first_name?.[0]}${post.author?.last_name?.[0]}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {post.title}
                            {post.is_pinned && <Pin className="h-4 w-4 text-primary" />}
                            {post.is_locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {post.is_anonymous ? "Anonymous" : `${post.author?.first_name} ${post.author?.last_name}`} •{" "}
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.upvotes}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.reply_count}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};