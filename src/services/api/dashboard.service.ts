import { GetAdminDashboardResponse, GetDashboardLaboratoriesResponse } from '../../interfaces/api';
import { getAdminDashboardMockResponse } from '../mocks';
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

/**
 * /dashboard/summary GET
 */
export async function getAdminDashboard(): Promise<GetAdminDashboardResponse> {
  return getAdminDashboardMockResponse();
}
