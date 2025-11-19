"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const professors = [];
const classrooms = [];
const courses = [];
const schedule = [];
// Додати професора
function addProfessor(professor) {
    professors.push(professor);
}
// Додати заняття (перевірка на конфлікти)
function addLesson(lesson) {
    const conflict = validateLesson(lesson);
    if (conflict !== null)
        return false;
    schedule.push(lesson);
    return true;
}
// Вільні аудиторії
function findAvailableClassrooms(timeSlot, dayOfWeek) {
    const busy = schedule
        .filter(l => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
        .map(l => l.classroomNumber);
    return classrooms
        .filter(c => !busy.includes(c.number))
        .map(c => c.number);
}
// Розклад професора
function getProfessorSchedule(professorId) {
    return schedule.filter(l => l.professorId === professorId);
}
// Перевірка
function validateLesson(lesson) {
    for (const existing of schedule) {
        const sameTime = existing.dayOfWeek === lesson.dayOfWeek &&
            existing.timeSlot === lesson.timeSlot;
        if (!sameTime)
            continue;
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
function getClassroomUtilization(classroomNumber) {
    const totalSlots = 5 * 5; // 5 днів × 5 слотів
    const used = schedule.filter(l => l.classroomNumber === classroomNumber).length;
    return (used / totalSlots) * 100;
}
// Найпопулярніший тип занять
function getMostPopularCourseType() {
    const counts = {
        Lecture: 0,
        Seminar: 0,
        Lab: 0,
        Practice: 0
    };
    for (const lesson of schedule) {
        const course = courses.find(c => c.id === lesson.courseId);
        if (course)
            counts[course.type]++;
    }
    return Object.keys(counts)
        .reduce((a, b) => counts[a] > counts[b] ? a : b);
}
// Переназначення аудиторії
function reassignClassroom(lessonId, newClassroomNumber) {
    const lesson = schedule[lessonId];
    if (!lesson)
        return false;
    const updated = {
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
function cancelLesson(lessonId) {
    schedule.splice(lessonId, 1);
}
//# sourceMappingURL=index.js.map