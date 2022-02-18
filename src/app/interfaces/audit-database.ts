export interface AuditDatabase {
  id: number;
  row_id: number;
  table_name: string;
  action: string;
  user: string;
  date_hour: string;
  row: AuditDatabaseCreateDelete | AuditDatabaseUpdateChanges;
}

export type AuditDatabaseCreateDelete = { [key: string]: any };
export type AuditDatabaseUpdateChanges = {
  [key: string]: { old: any[]; new: any[] };
};

export const mockAuditDatabaseList: AuditDatabase[] = [];
