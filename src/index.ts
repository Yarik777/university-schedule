// Дні тижня
type DayOfWeek =
  "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

// Часові слоти
type TimeSlot =
  "8:30-10:00" |
  "10:15-11:45" |
  "12:15-13:45" |
  "14:00-15:30" |
  "15:45-17:15";

// Типи занять
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";
type Professor = {
    id: number;
    name: string;
    department: string;
  };
  
  type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
  };
  
  type Course = {
    id: number;
    name: string;
    type: CourseType;
  };
  
  type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
  };
  const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];

// Додати професора
function addProfessor(professor: Professor): void {
  professors.push(professor);
}

// Додати заняття (перевірка на конфлікти)
function addLesson(lesson: Lesson): boolean {
  const conflict = validateLesson(lesson);
  if (conflict !== null) return false;

  schedule.push(lesson);
  return true;
}
// Вільні аудиторії
function findAvailableClassrooms(
    timeSlot: TimeSlot,
    dayOfWeek: DayOfWeek
  ): string[] {
    const busy = schedule
      .filter(l => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
      .map(l => l.classroomNumber);
  
    return classrooms
      .filter(c => !busy.includes(c.number))
      .map(c => c.number);
  }
  
  // Розклад професора
  function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(l => l.professorId === professorId);
  }
  type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
  };
  
  // Перевірка
  function validateLesson(lesson: Lesson): ScheduleConflict | null {
    for (const existing of schedule) {
      const sameTime =
        existing.dayOfWeek === lesson.dayOfWeek &&
        existing.timeSlot === lesson.timeSlot;
  
      if (!sameTime) continue;
  
      if (existing.professorId === lesson.professorId) {
        return {
          type: "ProfessorConflict",
          lessonDetails: existing
        };
      }
  
      if (existing.classroomNumber === lesson.classroomNumber) {
        return {
          type: "ClassroomConflict",
          lessonDetails: existing
        };
      }
    }
  
    return null;
  }
  // Завантаженість аудиторії
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = 5 * 5; // 5 днів × 5 слотів
    const used = schedule.filter(l => l.classroomNumber === classroomNumber).length;
    return (used / totalSlots) * 100;
  }
  
  // Найпопулярніший тип занять
  function getMostPopularCourseType(): CourseType {
    const counts: Record<CourseType, number> = {
      Lecture: 0,
      Seminar: 0,
      Lab: 0,
      Practice: 0
    };
  
    for (const lesson of schedule) {
      const course = courses.find(c => c.id === lesson.courseId);
      if (course) counts[course.type]++;
    }
  
    return (Object.keys(counts) as CourseType[])
      .reduce((a, b) => counts[a] > counts[b] ? a : b);
  }
  // Переназначення аудиторії
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule[lessonId];
    if (!lesson) return false;
  
    const updated: Lesson = {
      ...lesson,
      classroomNumber: newClassroomNumber
    };
  
    if (validateLesson(updated) === null) {
      schedule[lessonId] = updated;
      return true;
    }
  
    return false;
  }
  
  // Скасування заняття
  function cancelLesson(lessonId: number): void {
    schedule.splice(lessonId, 1);
  }
  