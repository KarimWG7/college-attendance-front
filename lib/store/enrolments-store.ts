import { create } from "zustand";
import { Enrolment } from "../types";

interface EnrolmentsStore {
  enrolments: Enrolment[];
  setEnrolments: (enrolments: Enrolment[]) => void;
}

export const useEnrolmentsStore = create<EnrolmentsStore>((set) => ({
  enrolments: [],
  setEnrolments: (enrolments) => set({ enrolments }),
}));
