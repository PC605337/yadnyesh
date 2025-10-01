import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Calendar, MessageCircle, Bell } from "lucide-react";
import { format } from "date-fns";

export default function CaregiverHub() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('caregiver_notes')
        .select('*')
        .eq('child_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        const reminderNotes = data.filter(n => n.reminder_date && new Date(n.reminder_date) >= new Date());
        const regularNotes = data.filter(n => !n.reminder_date || new Date(n.reminder_date) < new Date());
        setNotes(regularNotes);
        setReminders(reminderNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const getNoteIcon = (type: string) => {
    const icons: Record<string, string> = {
      medication: '💊',
      observation: '👀',
      milestone: '🎯',
      general: '📝'
    };
    return icons[type] || '📝';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-r from-blue-400 to-purple-500 border-4 border-white shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center gap-4">
            <span className="text-6xl">💝</span>
            <div>
              <h2 className="text-3xl font-bold text-white">Family Hub</h2>
              <p className="text-xl text-white/90">
                Messages and updates from your family!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reminders Section */}
      {reminders.length > 0 && (
        <Card className="bg-yellow-100 border-4 border-yellow-400 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <Bell className="h-6 w-6" />
              Today's Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{getNoteIcon(reminder.note_type)}</span>
                    <div className="flex-1">
                      <p className="text-lg text-gray-900">{reminder.content}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        📅 {format(new Date(reminder.reminder_date), 'PPP')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages from Family */}
      <Card className="bg-pink-100 border-4 border-pink-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-pink-900">
            <MessageCircle className="h-6 w-6" />
            Messages from Family
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">📭</span>
              <p className="text-pink-800 text-lg">
                No messages yet! Your family will send you notes here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div 
                  key={note.id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{getNoteIcon(note.note_type)}</span>
                    <div className="flex-1">
                      <p className="text-lg text-gray-900">{note.content}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        🕐 {format(new Date(note.created_at), 'PPp')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Schedule */}
      <Card className="bg-green-100 border-4 border-green-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Calendar className="h-6 w-6" />
            My Schedule Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌅</span>
                <div>
                  <p className="font-bold text-green-900">Morning Check-in</p>
                  <p className="text-sm text-green-800">Log how you're feeling</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎮</span>
                <div>
                  <p className="font-bold text-green-900">Play Time</p>
                  <p className="text-sm text-green-800">Fun brain games!</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌙</span>
                <div>
                  <p className="font-bold text-green-900">Evening Rest</p>
                  <p className="text-sm text-green-800">Time to relax</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Support */}
      <Card className="bg-purple-100 border-4 border-purple-300 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Heart className="h-6 w-6" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-800 text-lg mb-4">
            If you need anything or don't feel well, tell your family right away! They're here to help you. 💕
          </p>
          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white h-14 text-lg">
            <span className="mr-2">🔔</span> Tell My Family
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
