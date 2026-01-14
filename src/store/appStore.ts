import { create } from 'zustand';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'basic' | 'premium' | 'vip';
  status: 'active' | 'inactive' | 'expired';
  joinDate: string;
  expiryDate: string;
  avatar?: string;
}

interface ScheduleEvent {
  id: string;
  title: string;
  type: 'class' | 'appointment' | 'event';
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  enrolled: number;
  color: string;
}

interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  type: 'payment' | 'refund';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

interface AppState {
  members: Member[];
  scheduleEvents: ScheduleEvent[];
  transactions: Transaction[];
  currentStep: number;
  isLoading: boolean;
  sidebarOpen: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setIsLoading: (loading: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addScheduleEvent: (event: ScheduleEvent) => void;
  updateScheduleEvent: (id: string, updates: Partial<ScheduleEvent>) => void;
  deleteScheduleEvent: (id: string) => void;
}

// Sample data
const sampleMembers: Member[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    email: 'alex.t@email.com',
    phone: '+1 234 567 8901',
    membershipType: 'premium',
    status: 'active',
    joinDate: '2024-01-15',
    expiryDate: '2025-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 234 567 8902',
    membershipType: 'vip',
    status: 'active',
    joinDate: '2023-06-20',
    expiryDate: '2024-06-20',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.c@email.com',
    phone: '+1 234 567 8903',
    membershipType: 'basic',
    status: 'active',
    joinDate: '2024-03-10',
    expiryDate: '2024-09-10',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    phone: '+1 234 567 8904',
    membershipType: 'premium',
    status: 'inactive',
    joinDate: '2023-12-01',
    expiryDate: '2024-06-01',
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '+1 234 567 8905',
    membershipType: 'basic',
    status: 'expired',
    joinDate: '2023-08-15',
    expiryDate: '2024-02-15',
  },
];

const sampleScheduleEvents: ScheduleEvent[] = [
  {
    id: '1',
    title: 'Morning Yoga',
    type: 'class',
    instructor: 'Maria Santos',
    date: '2024-03-20',
    startTime: '07:00',
    endTime: '08:00',
    capacity: 20,
    enrolled: 15,
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'HIIT Training',
    type: 'class',
    instructor: 'John Trainer',
    date: '2024-03-20',
    startTime: '09:00',
    endTime: '10:00',
    capacity: 15,
    enrolled: 12,
    color: '#EF4444',
  },
  {
    id: '3',
    title: 'Personal Training',
    type: 'appointment',
    instructor: 'Mike Coach',
    date: '2024-03-20',
    startTime: '11:00',
    endTime: '12:00',
    capacity: 1,
    enrolled: 1,
    color: '#34D399',
  },
  {
    id: '4',
    title: 'Spin Class',
    type: 'class',
    instructor: 'Lisa Spin',
    date: '2024-03-20',
    startTime: '14:00',
    endTime: '15:00',
    capacity: 25,
    enrolled: 20,
    color: '#F59E0B',
  },
  {
    id: '5',
    title: 'Boxing Basics',
    type: 'class',
    instructor: 'Rocky Balboa',
    date: '2024-03-21',
    startTime: '16:00',
    endTime: '17:30',
    capacity: 12,
    enrolled: 8,
    color: '#8B5CF6',
  },
];

const sampleTransactions: Transaction[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'Alex Thompson',
    amount: 99.99,
    type: 'payment',
    status: 'completed',
    date: '2024-03-15',
    description: 'Premium Membership - Monthly',
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'Sarah Johnson',
    amount: 199.99,
    type: 'payment',
    status: 'completed',
    date: '2024-03-14',
    description: 'VIP Membership - Monthly',
  },
  {
    id: '3',
    memberId: '3',
    memberName: 'Mike Chen',
    amount: 49.99,
    type: 'payment',
    status: 'pending',
    date: '2024-03-13',
    description: 'Basic Membership - Monthly',
  },
  {
    id: '4',
    memberId: '4',
    memberName: 'Emily Davis',
    amount: 25.00,
    type: 'refund',
    status: 'completed',
    date: '2024-03-12',
    description: 'Personal Training - Refund',
  },
  {
    id: '5',
    memberId: '5',
    memberName: 'James Wilson',
    amount: 49.99,
    type: 'payment',
    status: 'failed',
    date: '2024-03-11',
    description: 'Basic Membership - Monthly',
  },
];

export const useAppStore = create<AppState>((set) => ({
  members: sampleMembers,
  scheduleEvents: sampleScheduleEvents,
  transactions: sampleTransactions,
  currentStep: 0,
  isLoading: false,
  sidebarOpen: true,

  setCurrentStep: (step) => set({ currentStep: step }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  addMember: (member) => set((state) => ({ members: [...state.members, member] })),
  updateMember: (id, updates) => set((state) => ({
    members: state.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
  })),
  deleteMember: (id) => set((state) => ({
    members: state.members.filter((m) => m.id !== id),
  })),
  
  addScheduleEvent: (event) => set((state) => ({ scheduleEvents: [...state.scheduleEvents, event] })),
  updateScheduleEvent: (id, updates) => set((state) => ({
    scheduleEvents: state.scheduleEvents.map((e) => (e.id === id ? { ...e, ...updates } : e)),
  })),
  deleteScheduleEvent: (id) => set((state) => ({
    scheduleEvents: state.scheduleEvents.filter((e) => e.id !== id),
  })),
}));
