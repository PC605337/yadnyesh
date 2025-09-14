import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageSquare,
  Users,
  Settings,
  Monitor,
  Camera,
  Volume2,
  VolumeX,
  ScreenShare,
  Clock,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConsultationSession {
  id: string;
  providerId: string;
  patientId: string;
  providerName: string;
  patientName: string;
  sessionType: 'video' | 'audio' | 'chat';
  status: 'waiting' | 'connected' | 'ended';
  startTime: Date;
  duration?: number;
}

export function VideoConsultation() {
  const [session, setSession] = useState<ConsultationSession | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, message: string, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionDuration, setSessionDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const { toast } = useToast();

  // Timer for session duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session && session.status === 'connected') {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const initializeMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setConnectionStatus('connecting');
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Media Access Error",
        description: "Unable to access camera or microphone",
        variant: "destructive",
      });
      throw error;
    }
  };

  const startConsultation = async (appointmentId: string) => {
    try {
      const stream = await initializeMediaDevices();
      
      // Initialize peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === 'connected') {
          setConnectionStatus('connected');
        }
      };

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        if (localStreamRef.current) {
          peerConnection.addTrack(track, localStreamRef.current);
        }
      });

      peerConnectionRef.current = peerConnection;

      // Mock session data - in real app, this would come from Supabase
      setSession({
        id: appointmentId,
        providerId: 'provider-1',
        patientId: 'patient-1',
        providerName: 'Dr. Sarah Johnson',
        patientName: 'John Doe',
        sessionType: 'video',
        status: 'connected',
        startTime: new Date()
      });

      toast({
        title: "Consultation Started",
        description: "You are now connected to the consultation",
      });

    } catch (error) {
      console.error('Error starting consultation:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to start video consultation",
        variant: "destructive",
      });
    }
  };

  const endConsultation = async () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }

    setSession(null);
    setConnectionStatus('disconnected');
    setSessionDuration(0);
    
    toast({
      title: "Consultation Ended",
      description: "The consultation has been terminated",
    });
  };

  const toggleVideo = async () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = async () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const shareScreen = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        // Replace video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = peerConnectionRef.current?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
        
        videoTrack.addEventListener('ended', () => {
          setIsScreenSharing(false);
          // Switch back to camera
          if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0];
            if (sender && cameraTrack) {
              sender.replaceTrack(cameraTrack);
            }
          }
        });
        
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing and switch back to camera
        if (localStreamRef.current) {
          const cameraTrack = localStreamRef.current.getVideoTracks()[0];
          const sender = peerConnectionRef.current?.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          
          if (sender && cameraTrack) {
            await sender.replaceTrack(cameraTrack);
          }
        }
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
      toast({
        title: "Screen Share Error",
        description: "Unable to share screen",
        variant: "destructive",
      });
    }
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      sender: 'You',
      message: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Consultation
          </CardTitle>
          <CardDescription>
            Start or join a telemedicine consultation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Active Consultation</h3>
            <p className="text-muted-foreground mb-4">
              Start a new consultation or join an existing one
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => startConsultation('demo-appointment')}>
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
              <Button variant="outline" onClick={() => startConsultation('demo-appointment-audio')}>
                <Phone className="h-4 w-4 mr-2" />
                Audio Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Session Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
                {connectionStatus}
              </Badge>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{session.providerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{formatDuration(sessionDuration)}</span>
              </div>
            </div>
            <Button variant="destructive" onClick={endConsultation}>
              <PhoneOff className="h-4 w-4 mr-2" />
              End Call
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Video Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Remote Video */}
          <Card>
            <CardContent className="p-2">
              <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  muted={false}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge>{session.providerName}</Badge>
                </div>
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <VideoOff className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Local Video (Picture-in-Picture) */}
          <div className="relative">
            <Card className="w-48 absolute bottom-4 right-4 z-10">
              <CardContent className="p-2">
                <div className="relative bg-black rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">You</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={isVideoEnabled ? "default" : "secondary"}
                  size="icon"
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant={isAudioEnabled ? "default" : "secondary"}
                  size="icon"
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant={isSpeakerEnabled ? "default" : "secondary"}
                  size="icon"
                  onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
                >
                  {isSpeakerEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant={isScreenSharing ? "default" : "outline"}
                  size="icon"
                  onClick={shareScreen}
                >
                  <ScreenShare className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chat Messages */}
            <div className="h-64 overflow-y-auto space-y-2 p-2 bg-muted/20 rounded">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <div className="font-semibold text-xs text-muted-foreground">
                    {msg.sender} - {msg.timestamp.toLocaleTimeString()}
                  </div>
                  <div className="mt-1 p-2 bg-background rounded text-sm">
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm" onClick={sendChatMessage}>
                <MessageSquare className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}