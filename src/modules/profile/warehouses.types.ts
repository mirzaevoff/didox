/**
 * Warehouses related types for Didox API
 */

export interface Warehouse {
  id: number;
  warehouseNumber: number;
  warehouseName: string;
  warehouseAddress: string;
}

export type WarehousesResponse = Warehouse[];