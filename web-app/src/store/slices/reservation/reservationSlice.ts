import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Reservation {
  id: string
  status: 'confirmed' | 'cancelled' | 'not confirmed'
  customer_name: string | null
  number_of_people: number | null
  table: string | null
  start_time: string | Date | null
  end_time: string | Date | null
  date: string | Date | null
}

export interface UnavailableDay {
  id: string
  start_time: string | Date | null
  end_time: string | Date | null
  date: string | Date | null
}
export type ReservationState = {
  reservations: Reservation[]
  selectedReservation: Reservation | null
  editReservation: Reservation | null
  unavailableDays: UnavailableDay[]
  editUnavailableDay: UnavailableDay | null
}

const initialState: ReservationState = {
  reservations: [],
  selectedReservation: null,
  editReservation: null,
  unavailableDays: [],
  editUnavailableDay: null,
}

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.reservations = action.payload
    },
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.push(action.payload)
    },
    updateReservation: (state, action: PayloadAction<Reservation>) => {
      const index = state.reservations.findIndex(
        (reservation) => reservation.id === action.payload.id
      )
      if (index !== -1) {
        state.reservations[index] = action.payload
      }
    },
    deleteReservation: (state, action: PayloadAction<string>) => {
      state.reservations = state.reservations.filter(
        (reservation) => reservation.id !== action.payload
      )
    },
    clearReservations: (state) => {
      state.reservations = []
      state.selectedReservation = null
    },
    getReservationById: (state, action: PayloadAction<string>) => {
      // mutate state.selectedReservation instead of returning a value from the reducer
      state.selectedReservation =
        state.reservations.find(
          (reservation) => reservation.id === action.payload
        ) || null
    },
    duplicateReservation: (state, action: PayloadAction<string>) => {
      const original = state.reservations.find((r) => r.id === action.payload)
      if (original) {
        state.reservations.push({
          ...original,
          id: crypto.randomUUID(),
        })
      }
    },
    setEditReservation: (state, action: PayloadAction<Reservation | null>) => {
      state.editReservation = action.payload
    },
    addUnavailableDay: (state, action: PayloadAction<UnavailableDay>) => {
      state.unavailableDays.push(action.payload)
    },
    updateUnavailableDay: (state, action: PayloadAction<UnavailableDay>) => {
      const index = state.unavailableDays.findIndex(
        (day) => day.id === action.payload.id
      )
      if (index !== -1) {
        state.unavailableDays[index] = action.payload
      }
    },
    deleteUnavailableDay: (state, action: PayloadAction<string>) => {
      state.unavailableDays = state.unavailableDays.filter(
        (day) => day.id !== action.payload
      )
    },
    setEditUnavailableDay: (
      state,
      action: PayloadAction<UnavailableDay | null>
    ) => {
      state.editUnavailableDay = action.payload
    },
  },
})

export const {
  setReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  clearReservations,
  getReservationById,
  duplicateReservation,
  setEditReservation,
  addUnavailableDay,
  updateUnavailableDay,
  deleteUnavailableDay,
  setEditUnavailableDay,
} = reservationSlice.actions

export default reservationSlice.reducer
