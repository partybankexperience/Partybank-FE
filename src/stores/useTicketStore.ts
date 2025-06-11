
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
  numberOfPeople: string;
  perks: string[];
  ticketAvailability: string;
  salesStart: string;
  startTime: string;
  salesEnd: string;
  endTime: string;
  savedTicketId?: string | null;
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
}

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: [],
      activeTicketIndex: 0,
      currentTicketData: {
        ticketCategory: "",
        ticketType: "",
        ticketAvailability: "",
        ticketName: "",
        purchaseLimit: "",
        stockAvailability: "",
        price: "",
        soldTarget: "",
        numberOfPeople: "",
        perks: [""],
        salesStart: "",
        startTime: "",
        salesEnd: "",
        endTime: ""
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
          numberOfPeople: "",
          perks: [""],
          ticketAvailability: "",
          salesStart: "",
          startTime: "",
          salesEnd: "",
          endTime: ""
        };

        set(state => ({
          tickets: [...state.tickets, newTicket],
          activeTicketIndex: state.tickets.length,
          currentTicketData: {
            ticketCategory: "",
            ticketType: "",
            ticketAvailability: "",
            ticketName: "",
            purchaseLimit: "",
            stockAvailability: "",
            price: "",
            soldTarget: "",
            numberOfPeople: "",
            perks: [""],
            salesStart: "",
            startTime: "",
            salesEnd: "",
            endTime: ""
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
            ticketAvailability: activeTicket.ticketAvailability,
            ticketName: activeTicket.name,
            purchaseLimit: activeTicket.purchaseLimit,
            stockAvailability: activeTicket.stockAvailability,
            price: activeTicket.price,
            soldTarget: activeTicket.soldTarget,
            numberOfPeople: activeTicket.numberOfPeople,
            perks: activeTicket.perks,
            salesStart: activeTicket.salesStart,
            startTime: activeTicket.startTime,
            salesEnd: activeTicket.salesEnd,
            endTime: activeTicket.endTime
          } : {
            ticketCategory: "",
            ticketType: "",
            ticketAvailability: "",
            ticketName: "",
            purchaseLimit: "",
            stockAvailability: "",
            price: "",
            soldTarget: "",
            numberOfPeople: "",
            perks: [""],
            salesStart: "",
            startTime: "",
            salesEnd: "",
            endTime: ""
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
          if (currentData.ticketName || currentData.ticketType) {
            const updatedTickets = [...state.tickets];
            const currentTicket = updatedTickets[state.activeTicketIndex];
            if (currentTicket) {
              updatedTickets[state.activeTicketIndex] = {
                ...currentTicket,
                name: currentData.ticketName || "",
                type: currentData.ticketType || "",
                category: currentData.ticketCategory || "",
                price: currentData.price || "",
                purchaseLimit: currentData.purchaseLimit || "",
                stockAvailability: currentData.stockAvailability || "",
                soldTarget: currentData.soldTarget || "",
                numberOfPeople: currentData.numberOfPeople || "",
                perks: currentData.perks || [""],
                ticketAvailability: currentData.ticketAvailability || "",
                salesStart: currentData.salesStart || "",
                startTime: currentData.startTime || "",
                salesEnd: currentData.salesEnd || "",
                endTime: currentData.endTime || ""
              };
            }

            // Load selected ticket data
            const selectedTicket = updatedTickets[ticketIndex];
            const newCurrentData = selectedTicket ? {
              ticketCategory: selectedTicket.category,
              ticketType: selectedTicket.type,
              ticketAvailability: selectedTicket.ticketAvailability,
              ticketName: selectedTicket.name,
              purchaseLimit: selectedTicket.purchaseLimit,
              stockAvailability: selectedTicket.stockAvailability,
              price: selectedTicket.price,
              soldTarget: selectedTicket.soldTarget,
              numberOfPeople: selectedTicket.numberOfPeople,
              perks: selectedTicket.perks,
              salesStart: selectedTicket.salesStart,
              startTime: selectedTicket.startTime,
              salesEnd: selectedTicket.salesEnd,
              endTime: selectedTicket.endTime
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
            ticketAvailability: selectedTicket.ticketAvailability,
            ticketName: selectedTicket.name,
            purchaseLimit: selectedTicket.purchaseLimit,
            stockAvailability: selectedTicket.stockAvailability,
            price: selectedTicket.price,
            soldTarget: selectedTicket.soldTarget,
            numberOfPeople: selectedTicket.numberOfPeople,
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

      getCurrentTicketData: (key: string) => {
        const state = get();
        return state.currentTicketData[key] || "";
      },

      saveCurrentDataToActiveTicket: () => {
        set(state => {
          const currentData = state.currentTicketData;
          if (!currentData.ticketName) return state;

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
            numberOfPeople: "",
            perks: [""],
            ticketAvailability: "",
            salesStart: "",
            startTime: "",
            salesEnd: "",
            endTime: ""
          };

          updatedTickets[state.activeTicketIndex] = {
            ...activeTicket,
            name: currentData.ticketName || "",
            type: currentData.ticketType || "",
            category: currentData.ticketCategory || "",
            price: currentData.price || "",
            purchaseLimit: currentData.purchaseLimit || "",
            stockAvailability: currentData.stockAvailability || "",
            soldTarget: currentData.soldTarget || "",
            numberOfPeople: currentData.numberOfPeople || "",
            perks: currentData.perks || [""],
            ticketAvailability: currentData.ticketAvailability || "",
            salesStart: currentData.salesStart || "",
            startTime: currentData.startTime || "",
            salesEnd: currentData.salesEnd || "",
            endTime: currentData.endTime || ""
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
        set({
          tickets: [],
          activeTicketIndex: 0,
          currentTicketData: {
            ticketCategory: "",
            ticketType: "",
            ticketAvailability: "",
            ticketName: "",
            purchaseLimit: "",
            stockAvailability: "",
            price: "",
            soldTarget: "",
            numberOfPeople: "",
            perks: [""],
            salesStart: "",
            startTime: "",
            salesEnd: "",
            endTime: ""
          }
        });
        localStorage.removeItem("ticket-management-storage");
      }
    }),
    {
      name: 'ticket-management-storage',
    }
  )
)
