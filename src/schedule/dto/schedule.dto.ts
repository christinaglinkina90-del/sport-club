export class ScheduleDto {
  id: number;
  serviceId: number;
  trainerId: number;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
}
