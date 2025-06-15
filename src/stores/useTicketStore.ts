import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TicketData {
  id: string;
  name: string;
  type: string;
  price: string;
  category: string;
  purchaseLimit: string;
  totalStock: string;
  soldTarget: string;
  groupSize: string;
  perks: string[];
  isUnlimited: boolean;
  salesStart: string;
  startTime: string;
  salesEnd: string;
  endTime: string;
  color: string;
  savedTicketId?: string | null;
  isSaved?: boolean;
  key?: string; // Optional key for local state management
}

interface TicketStore {
  tickets: TicketData[];
  activeTicketIndex: number;
  currentTicketData: Partial<TicketData> & { [key: string]: any };
  addTicket: () => void;
  updateTicket: (ticketIndex: number, data: Partial<TicketData>) => void;
  deleteTicket: (ticketIndex: number) => void;
  setActiveTicket: (ticketIndex: number) => void;
  setCurrentTicketData: (key: string, value: any) => void;
  getCurrentTicketData: (key: string) => any;
  resetTicketStore: () => void;
  saveCurrentDataToActiveTicket: () => void;
  markTicketAsSaved: (ticketIndex: number, savedTicketId: string) => void;
  getNextUnsavedTicket: () => number | null;
  hasUnsavedTickets: () => boolean;
  moveToNextUnsavedTicket: () => boolean;
}

const emptyTicket = (): TicketData => ({
  id:'',
  key: `ticket-${Date.now()}`,
  name: '',
  type: '',
  price: '',
  category: '',
  purchaseLimit: '',
  totalStock: '',
  soldTarget: '',
  groupSize: '',
  perks: [''],
  isUnlimited: false,
  salesStart: '',
  startTime: '',
  salesEnd: '',
  endTime: '',
  color: '',
});

const ticketToFormData = (ticket: TicketData): any => ({
  ticketName: ticket.name,
  ticketType: ticket.type,
  ticketCategory: ticket.category,
  isUnlimited: ticket.isUnlimited,
  price: ticket.price,
  purchaseLimit: ticket.purchaseLimit,
  totalStock: ticket.totalStock,
  soldTarget: ticket.soldTarget,
  groupSize: ticket.groupSize,
  perks: ticket.perks,
  salesStart: ticket.salesStart,
  startTime: ticket.startTime,
  salesEnd: ticket.salesEnd,
  endTime: ticket.endTime,
  color: ticket.color
});

const formDataToTicket = (data: Partial<TicketData> & { [key: string]: any }): Partial<TicketData> => ({
  name: data.ticketName || '',
  type: data.ticketType || '',
  category: data.ticketCategory || '',
  price: data.price || '',
  purchaseLimit: data.purchaseLimit || '',
  totalStock: data.totalStock || '',
  soldTarget: data.soldTarget || '',
  groupSize: data.groupSize || '',
  perks: data.perks || [''],
  isUnlimited: data.isUnlimited || false,
  salesStart: data.salesStart || '',
  startTime: data.startTime || '',
  salesEnd: data.salesEnd || '',
  endTime: data.endTime || '',
  color: data.color || ''
});

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: [],
      activeTicketIndex: 0,
      currentTicketData: ticketToFormData(emptyTicket()),

      addTicket: () => {
        set(state => ({
          tickets: [...state.tickets, emptyTicket()],
          activeTicketIndex: state.tickets.length,
          currentTicketData: ticketToFormData(emptyTicket())
        }));
      },

      updateTicket: (ticketIndex, data) => {
        set(state => {
          const updatedTickets = [...state.tickets];
          if (updatedTickets[ticketIndex]) {
            updatedTickets[ticketIndex] = { ...updatedTickets[ticketIndex], ...data };
          }
          return { tickets: updatedTickets };
        });
      },

      deleteTicket: (ticketIndex) => {
        set((state) => {
          if (state.tickets.length <= 1) return state;
      
          const updatedTickets = state.tickets.filter((_, i) => i !== ticketIndex);
      
          const newIndex =
            ticketIndex === state.activeTicketIndex
              ? Math.max(0, state.activeTicketIndex - 1)
              : state.activeTicketIndex > ticketIndex
              ? state.activeTicketIndex - 1
              : state.activeTicketIndex;
      
          return {
            ...state, // <-- ✅ Ensure other parts of state remain intact
            tickets: updatedTickets,
            activeTicketIndex: newIndex,
            currentTicketData: ticketToFormData(updatedTickets[newIndex] || emptyTicket()),
          };
        });
      }
      
      ,

      setActiveTicket: ticketIndex => {
        set(state => {
          const updatedTickets = [...state.tickets];
          const currentData = formDataToTicket(state.currentTicketData);

          updatedTickets[state.activeTicketIndex] = {
            ...updatedTickets[state.activeTicketIndex],
            ...currentData
          };

          return {
            tickets: updatedTickets,
            activeTicketIndex: ticketIndex,
            currentTicketData: ticketToFormData(updatedTickets[ticketIndex])
          };
        });
      },

      setCurrentTicketData: (key, value) => {
        set(state => ({
          currentTicketData: {
            ...state.currentTicketData,
            [key]: value
          }
        }));
      },

      getCurrentTicketData: key => {
        const state = get();
        return state.currentTicketData[key] || '';
      },

      saveCurrentDataToActiveTicket: () => {
        set(state => {
          const data = formDataToTicket(state.currentTicketData);
          const updatedTickets = [...state.tickets];
          updatedTickets[state.activeTicketIndex] = {
            ...updatedTickets[state.activeTicketIndex],
            ...data
          };

          return { tickets: updatedTickets };
        });
      },

      resetTicketStore: () => {
        localStorage.removeItem('ticket-management-storage');
        set({
          tickets: [],
          activeTicketIndex: 0,
          currentTicketData: ticketToFormData(emptyTicket())
        });
      },

      markTicketAsSaved: (ticketIndex, savedTicketId) => {
        set(state => {
          const updatedTickets = [...state.tickets];
          if (updatedTickets[ticketIndex]) {
            updatedTickets[ticketIndex] = {
              ...updatedTickets[ticketIndex],
              savedTicketId: savedTicketId || updatedTickets[ticketIndex].id,
              isSaved: !!(savedTicketId || updatedTickets[ticketIndex].id)
            };
          }
          return { tickets: updatedTickets };
        });
      },
      

      getNextUnsavedTicket: () => {
        const state = get();
        return state.tickets.findIndex(ticket => !ticket.isSaved);
      },

      hasUnsavedTickets: () => {
        return get().tickets.some(ticket => !ticket.isSaved);
      },

      moveToNextUnsavedTicket: () => {
        const nextIndex:any = get().getNextUnsavedTicket();
        if (nextIndex !== -1) {
          get().setActiveTicket(nextIndex);
          return true;
        }
        return false;
      }
    }),
    { name: 'ticket-management-storage' }
  )
);
