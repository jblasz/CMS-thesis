import { GetDashboardLaboratoriesResponse } from '../../interfaces/api';
import { getDashboardLaboratoriesMockResponse } from '../mocks/in-memory-course-mocks';

/**
 * /dashboard/laboratory GET
 */
export async function getDashboardLaboratories(
  timespan: number,
): Promise<GetDashboardLaboratoriesResponse> {
  const res = await getDashboardLaboratoriesMockResponse(timespan);
  res.laboratories.forEach((x) => {
    x.startsAt = new Date(x.startsAt);
    x.endsAt = new Date(x.endsAt);
  });
  return res;
}
