import { create } from 'zustand';
import { Lecture } from '../types';

interface LecturesStore {
  lectures: Lecture[];
  activeLecture: Lecture | null;
  selectedLecture: Lecture | null;
  setLectures: (lectures: Lecture[]) => void;
  setActiveLecture: (lecture: Lecture | null) => void;
  setSelectedLecture: (lecture: Lecture | null) => void;
}

export const useLecturesStore = create<LecturesStore>((set) => ({
  lectures: [],
  activeLecture: null,
  selectedLecture: null,
  setLectures: (lectures) => set({ lectures }),
  setActiveLecture: (lecture) => set({ activeLecture: lecture }),
  setSelectedLecture: (lecture) => set({ selectedLecture: lecture }),
}));
