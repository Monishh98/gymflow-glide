import { useState } from 'react';
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Users,
  MoreVertical,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/hooks/use-toast';

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const colors = [
  '#3B82F6', '#34D399', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'
];

export default function Schedule() {
  const { scheduleEvents, addScheduleEvent } = useAppStore();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'class' as 'class' | 'appointment' | 'event',
    instructor: '',
    startTime: '09:00',
    endTime: '10:00',
    capacity: 20,
  });

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.instructor) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const event = {
      id: Date.now().toString(),
      ...newEvent,
      date: currentDate.toISOString().split('T')[0],
      enrolled: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    addScheduleEvent(event);
    setIsAddDialogOpen(false);
    setNewEvent({
      title: '',
      type: 'class',
      instructor: '',
      startTime: '09:00',
      endTime: '10:00',
      capacity: 20,
    });

    toast({
      title: "Event Created",
      description: `${event.title} has been added to the schedule.`,
    });
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground mt-1">Manage classes, appointments, and gym events.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-heading">Add New Event</DialogTitle>
              <DialogDescription>
                Create a new class, appointment, or event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Morning Yoga"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value: 'class' | 'appointment' | 'event') => 
                    setNewEvent({ ...newEvent, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor *</Label>
                <Input
                  id="instructor"
                  value={newEvent.instructor}
                  onChange={(e) => setNewEvent({ ...newEvent, instructor: e.target.value })}
                  placeholder="John Trainer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Select
                    value={newEvent.startTime}
                    onValueChange={(value) => setNewEvent({ ...newEvent, startTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Select
                    value={newEvent.endTime}
                    onValueChange={(value) => setNewEvent({ ...newEvent, endTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newEvent.capacity}
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) || 1 })}
                  min={1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>Create Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextWeek}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <h2 className="text-xl font-heading font-semibold text-foreground">{formatMonthYear()}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Week days header */}
          <div className="grid grid-cols-7 border-t border-border">
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={`p-4 text-center border-r last:border-r-0 border-border ${
                  isToday(date) ? 'bg-primary/5' : ''
                }`}
              >
                <p className="text-sm text-muted-foreground">{weekDays[index]}</p>
                <p className={`text-2xl font-heading font-bold mt-1 ${
                  isToday(date) ? 'text-primary' : 'text-foreground'
                }`}>
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Schedule grid */}
          <div className="grid grid-cols-7 min-h-[400px]">
            {weekDates.map((date, dayIndex) => {
              const dayEvents = scheduleEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.toDateString() === date.toDateString();
              });

              return (
                <div
                  key={dayIndex}
                  className={`p-2 border-r last:border-r-0 border-t border-border ${
                    isToday(date) ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-2 rounded-lg text-xs cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: event.color + '20', borderLeft: `3px solid ${event.color}` }}
                      >
                        <p className="font-medium text-foreground truncate">{event.title}</p>
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{event.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{event.enrolled}/{event.capacity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's events list */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduleEvents.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  className="w-1 h-14 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{event.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.startTime} - {event.endTime} • {event.instructor}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{event.enrolled}/{event.capacity}</p>
                  <p className="text-xs text-muted-foreground">spots filled</p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
