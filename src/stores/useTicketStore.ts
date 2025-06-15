import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TicketData {
  id: string;
  name: string;
  type: string;
  price: string;
  category: string;
  purchaseLimit: string;
  stockAvailability: string;
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
  isSaved?: boolean; // Track if ticket is saved to backend
}

interface TicketStore {
  tickets: TicketData[];
  activeTicketIndex: number;
  currentTicketData: Partial<TicketData>;
  // Actions
  addTicket: () => void;
  updateTicket: (ticketIndex: number, data: Partial<TicketData>) => void;
  deleteTicket: (ticketIndex: number) => void;
  setActiveTicket: (ticketIndex: number) => void;
  setCurrentTicketData: (key: string, value: any) => void;
  getCurrentTicketData: (key: string) => any;
  resetTicketStore: () => void;
  // Save current form data to active ticket
  saveCurrentDataToActiveTicket: () => void;
  // Multi-ticket flow management
  markTicketAsSaved: (ticketIndex: number, savedTicketId: string) => void;
  getNextUnsavedTicket: () => number | null;
  hasUnsavedTickets: () => boolean;
  moveToNextUnsavedTicket: () => boolean;
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: [],
      activeTicketIndex: 0,
      currentTicketData: {
        ticketCategory: "",
        ticketType: "",
        isUnlimited: false,
        ticketName: "",
        purchaseLimit: "",
        stockAvailability: "",
        price: "",
        soldTarget: "",
        groupSize: "",
        perks: [""],
        salesStart: "",
        startTime: "",
        salesEnd: "",
        endTime: "",
        color: ""
      },

      addTicket: () => {
        const newTicket: TicketData = {
          id: `ticket-${Date.now()}`,
          name: "",
          type: "",
          price: "",
          category: "",
          purchaseLimit: "",
          stockAvailability: "",
          soldTarget: "",
          groupSize: "",
          perks: [""],
          isUnlimited: false,
          salesStart: "",
          startTime: "",
          salesEnd: "",
          endTime: "",
          color: ""
        };

        set(state => ({
          tickets: [...state.tickets, newTicket],
          activeTicketIndex: state.tickets.length,
          currentTicketData: {
            ticketCategory: "",
            ticketType: "",
            isUnlimited: false,
            ticketName: "",
            purchaseLimit: "",
            stockAvailability: "",
            price: "",
            soldTarget: "",
            groupSize: "",
            perks: [""],
            salesStart: "",
            startTime: "",
            salesEnd: "",
            endTime: "",
            color: ""
          }
        }));
      },

      updateTicket: (ticketIndex: number, data: Partial<TicketData>) => {
        set(state => {
          const updatedTickets = [...state.tickets];
          if (updatedTickets[ticketIndex]) {
            updatedTickets[ticketIndex] = {
              ...updatedTickets[ticketIndex],
              ...data
            };
          }
          return { tickets: updatedTickets };
        });
      },

      deleteTicket: (ticketIndex: number) => {
        set(state => {
          if (state.tickets.length <= 1) return state;

          const updatedTickets = state.tickets.filter((_, index) => index !== ticketIndex);
          const newActiveIndex = ticketIndex === state.activeTicketIndex 
            ? Math.max(0, state.activeTicketIndex - 1)
            : state.activeTicketIndex > ticketIndex 
              ? state.activeTicketIndex - 1 
              : state.activeTicketIndex;

          // Load new active ticket data
          const activeTicket = updatedTickets[newActiveIndex];
          const newCurrentData = activeTicket ? {
            ticketCategory: activeTicket.category,
            ticketType: activeTicket.type,
            isUnlimited: activeTicket.isUnlimited,
            ticketName: activeTicket.name,
            purchaseLimit: activeTicket.purchaseLimit,
            stockAvailability: activeTicket.stockAvailability,
            price: activeTicket.price,
            soldTarget: activeTicket.soldTarget,
            groupSize: activeTicket.groupSize,
            perks: activeTicket.perks,
            salesStart: activeTicket.salesStart,
            startTime: activeTicket.startTime,
            salesEnd: activeTicket.salesEnd,
            endTime: ""
          } : {
            ticketCategory: "",
            ticketType: "",
            isUnlimited: false,
            ticketName: "",
            purchaseLimit: "",
            stockAvailability: "",
            price: "",
            soldTarget: "",
            groupSize: "",
            perks: [""],
            salesStart: "",
            startTime: "",
            salesEnd: "",
            endTime: "",
            color: ""
          };

          return {
            tickets: updatedTickets,
            activeTicketIndex: newActiveIndex,
            currentTicketData: newCurrentData
          };
        });
      },

      setActiveTicket: (ticketIndex: number) => {
        set(state => {
          // Save current data to current active ticket before switching
          const currentData = state.currentTicketData;
          if ((currentData as any)?.ticketName || (currentData as any)?.ticketType) {
            const updatedTickets = [...state.tickets];
            const currentTicket = updatedTickets[state.activeTicketIndex];
            if (currentTicket) {
              updatedTickets[state.activeTicketIndex] = {
                ...currentTicket,
                name: (currentData as any)?.ticketName || "",
                type: (currentData as any)?.ticketType || "",
                category: (currentData as any)?.ticketCategory || "",
                price: (currentData as any)?.price || "",
                purchaseLimit: (currentData as any)?.purchaseLimit || "",
                stockAvailability: (currentData as any)?.stockAvailability || "",
                soldTarget: (currentData as any)?.soldTarget || "",
                groupSize: (currentData as any)?.groupSize || "",
                perks: (currentData as any)?.perks || [""],
                isUnlimited: (currentData as any)?.isUnlimited || "",
                salesStart: (currentData as any)?.salesStart || "",
                startTime: (currentData as any)?.startTime || "",
                salesEnd: (currentData as any)?.salesEnd || "",
                endTime: (currentData as any)?.endTime || ""
              };
            }

            // Load selected ticket data
            const selectedTicket = updatedTickets[ticketIndex];
            const newCurrentData = selectedTicket ? {
              ticketCategory: selectedTicket.category,
              ticketType: selectedTicket.type,
              isUnlimited: selectedTicket.isUnlimited,
              ticketName: selectedTicket.name,
              purchaseLimit: selectedTicket.purchaseLimit,
              stockAvailability: selectedTicket.stockAvailability,
              price: selectedTicket.price,
              soldTarget: selectedTicket.soldTarget,
              groupSize: selectedTicket.groupSize,
              perks: selectedTicket.perks,
              salesStart: selectedTicket.salesStart,
              startTime: selectedTicket.startTime,
              salesEnd: selectedTicket.salesEnd,
              endTime: selectedTicket.endTime,
              color: selectedTicket.color
            } : state.currentTicketData;

            return {
              tickets: updatedTickets,
              activeTicketIndex: ticketIndex,
              currentTicketData: newCurrentData
            };
          }

          // If no current data, just switch
          const selectedTicket = state.tickets[ticketIndex];
          const newCurrentData = selectedTicket ? {
            ticketCategory: selectedTicket.category,
            ticketType: selectedTicket.type,
            isUnlimited: selectedTicket.isUnlimited,
            ticketName: selectedTicket.name,
            purchaseLimit: selectedTicket.purchaseLimit,
            stockAvailability: selectedTicket.stockAvailability,
            price: selectedTicket.price,
            soldTarget: selectedTicket.soldTarget,
            groupSize: selectedTicket.groupSize,
            perks: selectedTicket.perks,
            salesStart: selectedTicket.salesStart,
            startTime: selectedTicket.startTime,
            salesEnd: selectedTicket.salesEnd,
            endTime: selectedTicket.endTime
          } : state.currentTicketData;

          return {
            activeTicketIndex: ticketIndex,
            currentTicketData: newCurrentData
          };
        });
      },

      setCurrentTicketData: (key: string, value: any) => {
        set(state => ({
          currentTicketData: {
            ...state.currentTicketData,
            [key]: value
          }
        }));
      },
//error -Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Partial<TicketData>'.
      getCurrentTicketData: (key: string) => {
        const state = get();
        return (state.currentTicketData as any)[key] || "";
      },

      saveCurrentDataToActiveTicket: () => {
        set(state => {
          const currentData = state.currentTicketData;
          if (!(currentData as any).ticketName) return state;

          const updatedTickets = [...state.tickets];
          const activeTicket = updatedTickets[state.activeTicketIndex] || {
            id: `ticket-${Date.now()}`,
            name: "",
            type: "",
            price: "",
            category: "",
            purchaseLimit: "",
            stockAvailability: "",
            soldTarget: "",
            groupSize: "",
            perks: [""],
            isUnlimited: false,
            salesStart: "",
            startTime: "",
            salesEnd: "",
            endTime: ""
          };

          updatedTickets[state.activeTicketIndex] = {
            ...activeTicket,
            name: (currentData as any).ticketName || "",
            type: (currentData as any).ticketType || "",
            category: (currentData as any).ticketCategory || "",
            price: (currentData as any).price || "",
            purchaseLimit: (currentData as any).purchaseLimit || "",
            stockAvailability: (currentData as any).stockAvailability || "",
            soldTarget: (currentData as any).soldTarget || "",
            groupSize: (currentData as any).groupSize || "",
            perks: (currentData as any).perks || [""],
            isUnlimited: (currentData as any).isUnlimited || "",
            salesStart: (currentData as any).salesStart || "",
            startTime: (currentData as any).startTime || "",
            salesEnd: (currentData as any).salesEnd || "",
            endTime: (currentData as any).endTime || "",
            color: (currentData as any).color || ""
          };

          // If this is the first ticket and tickets array was empty
          if (state.tickets.length === 0) {
            return {
              tickets: [updatedTickets[0]],
              activeTicketIndex: 0
            };
          }

          return { tickets: updatedTickets };
        });
      },

      resetTicketStore: () => {
        // Clear localStorage first
        localStorage.removeItem("ticket-management-storage");

        // Reset all state to initial values
        //error -'Object literal may only specify known properties, and 'ticketCategory' does not exist in type 'Partial<TicketData>'.
        set({
          tickets: [],
          activeTicketIndex: 0,
          currentTicketData: {
            ticketCategory: "",
            ticketType: "",
            isUnlimited: false,
            ticketName: "",
            purchaseLimit: "",
            stockAvailability: "",
            price: "",
            soldTarget: "",
            groupSize: "",
            perks: [""],
            salesStart: "",
            startTime: "",
            salesEnd: "",
            endTime: "",
            color: ""
          }
        });
      },

      markTicketAsSaved: (ticketIndex: number, savedTicketId: string) => {
        set(state => {
          const updatedTickets = [...state.tickets];
          if (updatedTickets[ticketIndex]) {
            updatedTickets[ticketIndex] = {
              ...updatedTickets[ticketIndex],
              savedTicketId,
              isSaved: true
            };
          }
          return { tickets: updatedTickets };
        });
      },

      getNextUnsavedTicket: () => {
        const state = get();
        for (let i = 0; i < state.tickets.length; i++) {
          if (!state.tickets[i].isSaved) {
            return i;
          }
        }
        return null;
      },

      hasUnsavedTickets: () => {
        const state = get();
        return state.tickets.some(ticket => !ticket.isSaved);
      },

      moveToNextUnsavedTicket: () => {
        const nextIndex = get().getNextUnsavedTicket();
        if (nextIndex !== null) {
          get().setActiveTicket(nextIndex);
          return true;
        }
        return false;
      }
    }),
    {
      name: 'ticket-management-storage',
    }
  )
)