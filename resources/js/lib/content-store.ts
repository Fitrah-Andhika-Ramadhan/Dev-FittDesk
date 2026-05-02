export type DocumentType =
  | 'SPR'
  | 'BLUEPRINT'
  | 'CONTRACT'
  | 'PERMIT'
  | 'REPORT'
  | 'INSPECTION'
  | 'CERTIFICATE'
  | 'INVOICE'
  | 'OTHER';

export type ReportType =
  | 'DAILY_PROGRESS'
  | 'WEEKLY_SUMMARY'
  | 'MONTHLY_FINANCIAL'
  | 'QUARTERLY_REVIEW'
  | 'BUDGET_STATUS'
  | 'SAFETY_REPORT'
  | 'QUALITY_REPORT'
  | 'CUSTOM';

export type ReportStatus = 'Completed' | 'In Progress' | 'Draft';

export type SprPaymentScheme = 'CASH' | 'KPR';

export type SprStatus =
  | 'DRAFT'
  | 'BOOKED'
  | 'BOOKING_VERIFIED'
  | 'PPJB'
  | 'KPR_PROCESS'
  | 'KPR_APPROVED'
  | 'UNDER_CONSTRUCTION'
  | 'HANDOVER'
  | 'CANCELLED';

export interface DocumentRecord {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description?: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
  docType: DocumentType;
  uploadedBy?: string;
  uploadedAt: Date;
  version: number;
}

export interface ReportRecord {
  id: string;
  userId: string;
  projectId: string;
  projectName: string;
  title: string;
  description?: string;
  reportType: ReportType;
  status: ReportStatus;
  pages: number;
  data: string;
  createdAt: Date;
}

export interface SprRecord {
  id: string;
  projectId: string;
  projectName: string;
  buyerName: string;
  buyerKtp: string;
  buyerContact: string;
  unitBlock: string;
  unitNumber: string;
  houseType: string;
  landArea: number;
  buildingArea: number;
  price: number;
  paymentScheme: SprPaymentScheme;
  bookingFee: number;
  dpPlan: number;
  installmentPlan: string;
  refundPolicy: string;
  status: SprStatus;
  bookingProofUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectName = 'Metro Paragon Residence';
const defaultUserId = '1';

function createDataUrl(content: string, mimeType = 'text/plain;charset=utf-8') {
  return `data:${mimeType},${encodeURIComponent(content)}`;
}

function toReadableReportType(reportType: ReportType) {
  const map: Record<ReportType, string> = {
    DAILY_PROGRESS: 'Daily Progress',
    WEEKLY_SUMMARY: 'Weekly Summary',
    MONTHLY_FINANCIAL: 'Monthly Financial',
    QUARTERLY_REVIEW: 'Quarterly Review',
    BUDGET_STATUS: 'Budget Status',
    SAFETY_REPORT: 'Safety Report',
    QUALITY_REPORT: 'Quality Report',
    CUSTOM: 'Custom',
  };

  return map[reportType];
}

export const documentTypeLabels: Record<DocumentType, string> = {
  SPR: 'SPR (Surat Pemesanan Rumah)',
  BLUEPRINT: 'Blueprint',
  CONTRACT: 'Contract',
  PERMIT: 'Permit',
  REPORT: 'Report',
  INSPECTION: 'Inspection',
  CERTIFICATE: 'Certificate',
  INVOICE: 'Invoice',
  OTHER: 'Other',
};

export const reportTypeLabels: Record<ReportType, string> = {
  DAILY_PROGRESS: 'Daily Progress',
  WEEKLY_SUMMARY: 'Weekly Summary',
  MONTHLY_FINANCIAL: 'Monthly Financial',
  QUARTERLY_REVIEW: 'Quarterly Review',
  BUDGET_STATUS: 'Budget Status',
  SAFETY_REPORT: 'Safety Report',
  QUALITY_REPORT: 'Quality Report',
  CUSTOM: 'Custom',
};

export const sprStatusLabels: Record<SprStatus, string> = {
  DRAFT: 'Draft',
  BOOKED: 'Booked',
  BOOKING_VERIFIED: 'Booking Verified',
  PPJB: 'PPJB',
  KPR_PROCESS: 'KPR Process',
  KPR_APPROVED: 'KPR Approved',
  UNDER_CONSTRUCTION: 'Under Construction',
  HANDOVER: 'Handover',
  CANCELLED: 'Cancelled',
};

export const documentStore: DocumentRecord[] = [
  {
    id: 'doc-1',
    projectId: '1',
    projectName,
    title: 'SPR Metro Paragon - Phase 2',
    description: 'Surat Pernyataan Rencana untuk tahap pengembangan fase 2.',
    fileType: 'application/pdf',
    fileUrl: createDataUrl('SPR Metro Paragon - Phase 2\n\nDokumen ini berisi ringkasan perencanaan fase 2.'),
    fileSize: 2.5,
    docType: 'SPR',
    uploadedBy: 'admin@fittdesk.com',
    uploadedAt: new Date('2026-04-08T08:00:00Z'),
    version: 1,
  },
  {
    id: 'doc-2',
    projectId: '1',
    projectName,
    title: 'Architecture Blueprint - Block A',
    description: 'Blueprint arsitektur untuk blok A dan unit hunian.',
    fileType: 'application/pdf',
    fileUrl: createDataUrl('Architecture Blueprint - Block A\n\nBlueprint ini disiapkan untuk kebutuhan presentasi.'),
    fileSize: 15.8,
    docType: 'BLUEPRINT',
    uploadedBy: 'admin@fittdesk.com',
    uploadedAt: new Date('2026-04-07T08:00:00Z'),
    version: 1,
  },
  {
    id: 'doc-3',
    projectId: '1',
    projectName,
    title: 'Construction Contract',
    description: 'Kontrak konstruksi utama dengan vendor pelaksana.',
    fileType: 'application/pdf',
    fileUrl: createDataUrl('Construction Contract\n\nDokumen kontrak konstruksi utama.'),
    fileSize: 5.2,
    docType: 'CONTRACT',
    uploadedBy: 'admin@fittdesk.com',
    uploadedAt: new Date('2026-04-05T08:00:00Z'),
    version: 1,
  },
  {
    id: 'doc-4',
    projectId: '1',
    projectName,
    title: 'Monthly Safety Inspection Report',
    description: 'Laporan inspeksi keselamatan bulanan.',
    fileType: 'application/pdf',
    fileUrl: createDataUrl('Monthly Safety Inspection Report\n\nHasil inspeksi keselamatan bulanan.'),
    fileSize: 3.1,
    docType: 'INSPECTION',
    uploadedBy: 'admin@fittdesk.com',
    uploadedAt: new Date('2026-04-01T08:00:00Z'),
    version: 1,
  },
  {
    id: 'doc-5',
    projectId: '1',
    projectName,
    title: 'Budget Report Q2 2024',
    description: 'Laporan anggaran kuartal 2.',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileUrl: createDataUrl('Budget Report Q2 2024\n\nRingkasan anggaran kuartal 2.'),
    fileSize: 1.8,
    docType: 'REPORT',
    uploadedBy: 'finance@fittdesk.com',
    uploadedAt: new Date('2026-03-31T08:00:00Z'),
    version: 1,
  },
];

export const reportStore: ReportRecord[] = [
  {
    id: 'rep-1',
    userId: defaultUserId,
    projectId: '1',
    projectName,
    title: 'Monthly Progress Report - March 2026',
    description: 'Comprehensive overview of construction progress, budget status, and upcoming milestones',
    reportType: 'MONTHLY_FINANCIAL',
    status: 'Completed',
    pages: 24,
    data: JSON.stringify({
      period: 'March 2026',
      summary: 'Monthly progress overview',
      progress: 65,
      budgetUsed: 325000000,
      notes: ['Foundation complete', 'Structure ongoing'],
    }, null, 2),
    createdAt: new Date('2026-03-31T09:00:00Z'),
  },
  {
    id: 'rep-2',
    userId: defaultUserId,
    projectId: '1',
    projectName,
    title: 'Safety & Compliance Report - Q1 2026',
    description: 'Quarterly safety incidents, compliance audits, and corrective actions',
    reportType: 'SAFETY_REPORT',
    status: 'Completed',
    pages: 18,
    data: JSON.stringify({
      period: 'Q1 2026',
      summary: 'Safety and compliance overview',
      incidents: 2,
      audits: 4,
      correctiveActions: 6,
    }, null, 2),
    createdAt: new Date('2026-03-30T09:00:00Z'),
  },
  {
    id: 'rep-3',
    userId: defaultUserId,
    projectId: '1',
    projectName,
    title: 'Budget Analysis & Forecast',
    description: 'Detailed breakdown of expenditures, budget variance analysis, and financial projections',
    reportType: 'BUDGET_STATUS',
    status: 'Completed',
    pages: 32,
    data: JSON.stringify({
      summary: 'Budget analysis and forecast',
      projectedVariance: -12000000,
      cashFlow: 'Stable',
      nextReview: '2026-04-15',
    }, null, 2),
    createdAt: new Date('2026-03-28T09:00:00Z'),
  },
  {
    id: 'rep-4',
    userId: defaultUserId,
    projectId: '1',
    projectName,
    title: 'Project Timeline & Milestones',
    description: 'Scheduled completion dates for each phase, current delays, and recovery plans',
    reportType: 'WEEKLY_SUMMARY',
    status: 'In Progress',
    pages: 15,
    data: JSON.stringify({
      summary: 'Timeline overview',
      delayedTasks: 3,
      onTrackTasks: 12,
      riskLevel: 'Medium',
    }, null, 2),
    createdAt: new Date('2026-03-25T09:00:00Z'),
  },
  {
    id: 'rep-5',
    userId: defaultUserId,
    projectId: '1',
    projectName,
    title: 'Quality Assurance Report',
    description: 'Inspection results, defect log, and quality improvement initiatives',
    reportType: 'QUALITY_REPORT',
    status: 'Completed',
    pages: 22,
    data: JSON.stringify({
      summary: 'Quality assurance review',
      defectCount: 5,
      passRate: 96,
      actions: ['Minor patching', 'Re-inspection scheduled'],
    }, null, 2),
    createdAt: new Date('2026-03-20T09:00:00Z'),
  },
  {
    id: 'rep-6',
    userId: defaultUserId,
    projectId: '1',
    projectName,
    title: 'Resource & Team Performance',
    description: 'Workforce metrics, productivity analysis, and team capacity planning',
    reportType: 'CUSTOM',
    status: 'Completed',
    pages: 20,
    data: JSON.stringify({
      summary: 'Team performance review',
      productivity: 87,
      crewCount: 64,
      overtimeHours: 120,
    }, null, 2),
    createdAt: new Date('2026-03-15T09:00:00Z'),
  },
];

export const sprStore: SprRecord[] = [
  {
    id: 'spr-1',
    projectId: '1',
    projectName,
    buyerName: 'Budi Santoso',
    buyerKtp: '3174xxxxxxxxxxxx',
    buyerContact: '0812-1111-2222',
    unitBlock: 'A',
    unitNumber: 'A-12',
    houseType: 'Type 72/120',
    landArea: 120,
    buildingArea: 72,
    price: 950000000,
    paymentScheme: 'KPR',
    bookingFee: 10000000,
    dpPlan: 190000000,
    installmentPlan: 'KPR 15 tahun - Bank partner',
    refundPolicy: 'Booking fee non-refundable setelah verifikasi unit',
    status: 'BOOKING_VERIFIED',
    bookingProofUrl: createDataUrl('Bukti booking fee untuk SPR A-12'),
    notes: 'Menunggu proses PPJB',
    createdAt: new Date('2026-04-01T09:00:00Z'),
    updatedAt: new Date('2026-04-02T10:00:00Z'),
  },
  {
    id: 'spr-2',
    projectId: '1',
    projectName,
    buyerName: 'Siti Rahma',
    buyerKtp: '3173xxxxxxxxxxxx',
    buyerContact: '0813-3333-4444',
    unitBlock: 'B',
    unitNumber: 'B-07',
    houseType: 'Type 60/90',
    landArea: 90,
    buildingArea: 60,
    price: 780000000,
    paymentScheme: 'CASH',
    bookingFee: 15000000,
    dpPlan: 390000000,
    installmentPlan: 'Cash bertahap 6x',
    refundPolicy: 'Refund 50% sebelum PPJB ditandatangani',
    status: 'UNDER_CONSTRUCTION',
    bookingProofUrl: createDataUrl('Bukti booking fee untuk SPR B-07'),
    notes: 'Progress pembangunan 45%',
    createdAt: new Date('2026-03-15T09:00:00Z'),
    updatedAt: new Date('2026-04-06T10:00:00Z'),
  },
];

const nextId = (prefix: string, items: { id: string }[]) => {
  const numbers = items
    .map((item) => Number.parseInt(item.id.replace(/[^0-9]/g, ''), 10))
    .filter((num) => !Number.isNaN(num));

  return `${prefix}${Math.max(0, ...numbers) + 1}`;
};

export function getDocuments(filters?: { search?: string; type?: string; projectId?: string }) {
  let items = [...documentStore].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

  if (filters?.projectId) {
    items = items.filter((item) => item.projectId === filters.projectId);
  }

  if (filters?.type && filters.type !== 'all') {
    items = items.filter((item) => item.docType === filters.type);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    items = items.filter((item) => {
      return [item.title, item.description || '', item.projectName, item.docType, item.fileType]
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }

  return items;
}

export function createDocument(input: Omit<DocumentRecord, 'id' | 'uploadedAt' | 'version' | 'projectName'> & { projectName?: string }) {
  const doc: DocumentRecord = {
    ...input,
    id: nextId('doc-', documentStore),
    projectName: input.projectName || projectName,
    uploadedAt: new Date(),
    version: 1,
  };

  documentStore.unshift(doc);
  return doc;
}

export function updateDocument(id: string, patch: Partial<DocumentRecord>) {
  const index = documentStore.findIndex((item) => item.id === id);
  if (index === -1) return null;
  documentStore[index] = { ...documentStore[index], ...patch };
  return documentStore[index];
}

export function deleteDocument(id: string) {
  const index = documentStore.findIndex((item) => item.id === id);
  if (index === -1) return false;
  documentStore.splice(index, 1);
  return true;
}

export function getDocumentById(id: string) {
  return documentStore.find((item) => item.id === id) || null;
}

export function getDocumentStats(items = documentStore) {
  const totalSize = items.reduce((sum, item) => sum + item.fileSize, 0);
  const byType = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.docType] = (acc[item.docType] || 0) + 1;
    return acc;
  }, {});

  return {
    total: items.length,
    totalSize,
    byType,
  };
}

export function getReports(filters?: { search?: string; type?: string; status?: string; projectId?: string }) {
  let items = [...reportStore].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  if (filters?.projectId) {
    items = items.filter((item) => item.projectId === filters.projectId);
  }

  if (filters?.type && filters.type !== 'all') {
    items = items.filter((item) => item.reportType === filters.type);
  }

  if (filters?.status && filters.status !== 'all') {
    items = items.filter((item) => item.status === filters.status);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    items = items.filter((item) => {
      return [item.title, item.description || '', item.projectName, toReadableReportType(item.reportType), item.status]
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }

  return items;
}

export function createReport(input: Omit<ReportRecord, 'id' | 'createdAt' | 'projectName'> & { projectName?: string }) {
  const report: ReportRecord = {
    ...input,
    id: nextId('rep-', reportStore),
    projectName: input.projectName || projectName,
    createdAt: new Date(),
  };

  reportStore.unshift(report);
  return report;
}

export function updateReport(id: string, patch: Partial<ReportRecord>) {
  const index = reportStore.findIndex((item) => item.id === id);
  if (index === -1) return null;
  reportStore[index] = { ...reportStore[index], ...patch };
  return reportStore[index];
}

export function deleteReport(id: string) {
  const index = reportStore.findIndex((item) => item.id === id);
  if (index === -1) return false;
  reportStore.splice(index, 1);
  return true;
}

export function getReportById(id: string) {
  return reportStore.find((item) => item.id === id) || null;
}

export function getReportStats(items = reportStore) {
  const totalPages = items.reduce((sum, item) => sum + item.pages, 0);
  const completed = items.filter((item) => item.status === 'Completed').length;
  const inProgress = items.filter((item) => item.status === 'In Progress').length;
  const draft = items.filter((item) => item.status === 'Draft').length;
  const averagePages = items.length > 0 ? Math.round(totalPages / items.length) : 0;

  return {
    total: items.length,
    completed,
    inProgress,
    draft,
    averagePages,
  };
}

export function reportTypeToLabel(reportType: ReportType) {
  return reportTypeLabels[reportType];
}

export function reportLabelToType(label: string): ReportType {
  const found = (Object.keys(reportTypeLabels) as ReportType[]).find(
    (key) => reportTypeLabels[key].toLowerCase() === label.toLowerCase()
  );

  return found || 'CUSTOM';
}

export function getReportPayload(report: ReportRecord) {
  return {
    ...report,
    reportTypeLabel: reportTypeToLabel(report.reportType),
  };
}

export function getSprList(filters?: {
  search?: string;
  status?: string;
  paymentScheme?: string;
  projectId?: string;
}) {
  let items = [...sprStore].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  if (filters?.projectId) {
    items = items.filter((item) => item.projectId === filters.projectId);
  }

  if (filters?.status && filters.status !== 'all') {
    items = items.filter((item) => item.status === filters.status);
  }

  if (filters?.paymentScheme && filters.paymentScheme !== 'all') {
    items = items.filter((item) => item.paymentScheme === filters.paymentScheme);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    items = items.filter((item) => {
      return [
        item.buyerName,
        item.buyerKtp,
        item.buyerContact,
        item.projectName,
        item.unitBlock,
        item.unitNumber,
        item.houseType,
        item.status,
        item.paymentScheme,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }

  return items;
}

export function createSpr(
  input: Omit<SprRecord, 'id' | 'createdAt' | 'updatedAt' | 'projectName'> & { projectName?: string }
) {
  const item: SprRecord = {
    ...input,
    id: nextId('spr-', sprStore),
    projectName: input.projectName || projectName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  sprStore.unshift(item);
  return item;
}

export function updateSpr(id: string, patch: Partial<SprRecord>) {
  const index = sprStore.findIndex((item) => item.id === id);
  if (index === -1) return null;
  sprStore[index] = {
    ...sprStore[index],
    ...patch,
    updatedAt: new Date(),
  };
  return sprStore[index];
}

export function deleteSpr(id: string) {
  const index = sprStore.findIndex((item) => item.id === id);
  if (index === -1) return false;
  sprStore.splice(index, 1);
  return true;
}

export function getSprById(id: string) {
  return sprStore.find((item) => item.id === id) || null;
}

export function getSprStats(items = sprStore) {
  const byStatus = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const byPaymentScheme = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.paymentScheme] = (acc[item.paymentScheme] || 0) + 1;
    return acc;
  }, {});

  return {
    total: items.length,
    booked: byStatus.BOOKED || 0,
    verified: byStatus.BOOKING_VERIFIED || 0,
    construction: byStatus.UNDER_CONSTRUCTION || 0,
    handover: byStatus.HANDOVER || 0,
    byStatus,
    byPaymentScheme,
  };
}
