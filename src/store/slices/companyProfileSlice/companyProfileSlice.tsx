import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ajs-server.hostdonor.com/api/v1";
const FILE_URL =
  process.env.NEXT_PUBLIC_FILE_URL || "https://ajs-files.hostdonor.com/api/v1";

interface UserInfo {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Company {
  _id: string;
  companyName: string;
  website: string;
  foundedYear: string;
  numberOfEmployees: string;
  sector: string;
  email: string;
  phone?: string;
  languages: string[];
  description: string;
  services: string[];
  companyImages: string[];
  address: string;
  city: string;
  country: string;
  province: string;
  userInfo: UserInfo;
  companyLogo: string;
  mediaUrl: string;
  profileCompletion: number;
}

interface CompanyState {
  company: Company | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CompanyState = {
  company: null,
  status: "idle",
  error: null,
};

export const fetchCompanyProfile = createAsyncThunk<
  Company,
  string,
  { rejectValue: string }
>("company/fetchCompanyProfile", async (companyId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/company/${companyId}`);
    return response.data.company;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while fetching the company profile."
      );
    } else {
      return rejectWithValue("An unknown error occurred");
    }
  }
});

export const updateCompanyProfile = createAsyncThunk<
  Company,
  { id: string; updates: Partial<Company>; token: string },
  { rejectValue: string }
>(
  "company/updateCompanyProfile",
  async ({ id, updates, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/company/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.company;
    } catch (error: any) {
      console.log({ error });
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          // error.response.data.message ||
          error.response.data.errors ||
            "An error occurred while updating the company profile."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const addOrUpdateCompanyLogo = createAsyncThunk<
  { companyLogo: string },
  { companyId: string; logo: FormData; token: string },
  { rejectValue: string }
>(
  "company/addOrUpdateCompanyLogo",
  async ({ companyId, logo, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${FILE_URL}/files/company-logo/${companyId}`,
        logo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while adding/updating the company logo."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const addOrUpdateCompanyImages = createAsyncThunk<
  { companyImages: string[] },
  { companyId: string; images: File[]; token: string },
  { rejectValue: string }
>(
  "company/addOrUpdateCompanyImages",
  async ({ companyId, images, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("companyImages", image);
      });
      const response = await axios.patch(
        `${FILE_URL}/files/company-images/${companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "An error occurred while adding/updating the company images."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const deleteCompanyImage = createAsyncThunk<
  { message: string },
  { filename: string; token: string },
  { rejectValue: string }
>(
  "company/deleteCompanyImage",
  async ({ filename, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/company-images`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          filename, // Pass the full image URL as a query parameter
        },
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          // error.response.data.message ||
          error.response.data.errors ||
            "An error occurred while deleting the company image."
        );
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

const companyProfileSlice = createSlice({
  name: "companyProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCompanyProfile.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          state.company = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCompanyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(updateCompanyProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        updateCompanyProfile.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.status = "succeeded";
          state.company = action.payload;
          state.error = null;
        }
      )
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(addOrUpdateCompanyLogo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOrUpdateCompanyLogo.fulfilled, (state, action) => {
        if (state.company) {
          state.company.companyLogo = action.payload.companyLogo;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addOrUpdateCompanyLogo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(addOrUpdateCompanyImages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addOrUpdateCompanyImages.fulfilled, (state, action) => {
        if (state.company) {
          state.company.companyImages = action.payload.companyImages;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addOrUpdateCompanyImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      })
      .addCase(deleteCompanyImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCompanyImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteCompanyImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "An unknown error occurred";
      });
  },
});

export default companyProfileSlice.reducer;
