"use client";
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface Notification {
  _id: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  avatar: string;
}

interface NotificationsState {
  notifications: Notification[];
  unseenCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unseenCount: 0,
  status: 'idle',
  error: null,
};

export const fetchNotifications = createAsyncThunk<
  Notification[], // Output type
  { token: string }, // Input type
  { rejectValue: string } // Rejected value type
>('notifications/fetchNotifications', async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.notifications;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching the notifications.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Async Thunk to mark a notification as read
export const markNotificationAsRead = createAsyncThunk<
  void,
  { id: string; token: string },
  { rejectValue: string }
>('notifications/markNotificationAsRead', async ({ id, token }, { rejectWithValue }) => {
  try {
    await axios.patch(`${API_URL}/notifications/${id}/read`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while marking the notification as read.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Async Thunk to get unseen notifications count
export const getUnseenNotificationsCount = createAsyncThunk<
  number,
  { token: string },
  { rejectValue: string }
>('notifications/getUnseenNotificationsCount', async ({ token }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/notifications/unseen/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.count;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching the unseen notifications count.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Async Thunk to mark all notifications as seen
export const markAllNotificationsAsSeen = createAsyncThunk<
  void,
  { token: string },
  { rejectValue: string }
>('notifications/markAllNotificationsAsSeen', async ({ token }, { rejectWithValue }) => {
  try {
    await axios.patch(`${API_URL}/notifications/unseen/mark-all-as-seen`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while marking all notifications as seen.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

// Async Thunk to delete a notification
export const deleteNotification = createAsyncThunk<
  void,
  { id: string; token: string },
  { rejectValue: string }
>('notifications/deleteNotification', async ({ id, token }, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(error.response.data.message || 'An error occurred while deleting the notification.');
    } else {
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = state.notifications.map((notification) =>
          notification._id === action.meta.arg.id ? { ...notification, isRead: true } : notification
        );
        state.error = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(getUnseenNotificationsCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUnseenNotificationsCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'succeeded';
        state.unseenCount = action.payload;
        state.error = null;
      })
      .addCase(getUnseenNotificationsCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(markAllNotificationsAsSeen.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(markAllNotificationsAsSeen.fulfilled, (state) => {
        state.status = 'succeeded';
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));
        state.unseenCount = 0;
        state.error = null;
      })
      .addCase(markAllNotificationsAsSeen.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An unknown error occurred';
      })
      .addCase(deleteNotification.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = state.notifications.filter(
          (notification) => notification._id !== action.meta.arg.id
        );
        state.error = null;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ? String(action.payload) : 'An unknown error occurred';
      });
  },
});

export default notificationsSlice.reducer;
