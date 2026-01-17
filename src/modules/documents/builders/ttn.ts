import { BaseDocumentBuilder, DocumentBuilderFactory } from './base/BaseDocumentBuilder.js';

/**
 * DX-friendly TTN Draft interface
 * 
 * Developer-friendly structure for building transport waybill documents.
 * This gets transformed to Didox API JSON format in build().
 */
export interface TtnDraft {
  /** Waybill document information */
  waybill: {
    no: string;
    date: string;
    localType?: 0 | 1 | 4;
    deliveryType: number;
  };

  /** Optional contract reference */
  contract?: {
    no: string;
    date: string;
  };

  /** Consignor (sender) organization details */
  consignor: Party;

  /** Consignee (receiver) organization details */
  consignee: Party;

  /** Carrier organization details */
  carrier: Party;

  /** Optional freight forwarder */
  freightForwarder?: Party;

  /** Optional client organization */
  client?: Party;

  /** Optional payer organization */
  payer?: Party;

  /** Transport information */
  transport: {
    type: 1 | 2; // 1 - автомобильный, 2 - железнодорожный
    truck: {
      regNo: string;
      model: string;
    };
    trailer?: {
      regNo: string;
      model: string;
    };
    driver: {
      pinfl: string;
      fullName: string;
    };
  };

  /** Product groups with loading/unloading points */
  productGroups: ProductGroupDraft[];

  /** Total delivery calculation */
  totals: {
    distanceKm: number;
    pricePerKm: number;
  };

  /** Responsible person */
  responsiblePerson: {
    pinfl: string;
    fullName: string;
  };

  /** Optional TTN flags */
  flags?: {
    hasCommittent?: boolean;
    singleSidedType?: number;
  };
}

/**
 * DX-friendly Party interface
 * 
 * Organization details used across TTN document.
 */
export interface Party {
  /** Tax identification number */
  tin: string;
  /** Organization name */
  name: string;
  /** Optional branch code */
  branchCode?: string;
  /** Optional branch name */
  branchName?: string;
}

/**
 * DX-friendly Product Group Draft interface
 * 
 * Group of products/goods with same loading/unloading points.
 */
export interface ProductGroupDraft {
  /** Loading point information */
  loadingPoint: {
    address: string;
    tin: string;
    name: string;
  };

  /** Loading trustee (person responsible for loading) */
  loadingTrustee?: {
    pinfl: string;
    fullName: string;
  };

  /** Unloading point information */
  unloadingPoint: {
    address: string;
    tin: string;
    name: string;
  };

  /** Unloading trustee (person responsible for unloading) */
  unloadingTrustee?: {
    pinfl: string;
    fullName: string;
  };

  /** Empowerment document information */
  empowerment?: {
    no: string;
    date: string;
    series?: string;
  };

  /** Products/goods in this group */
  products: TtnProductDraft[];
}

/**
 * DX-friendly TTN Product Draft interface
 * 
 * Simple structure for adding products/goods to TTN.
 */
export interface TtnProductDraft {
  /** Product/good name */
  name: string;
  /** Product catalog code */
  catalogCode: string;
  /** Product catalog name */
  catalogName: string;
  /** Package code */
  packageCode: string;
  /** Package name */
  packageName: string;
  /** Count/quantity */
  count: number;
  /** Unit price per kg/unit */
  price: number;
  /** VAT rate (optional) */
  vatRate?: number;
}

/**
 * API TTN Payload interface
 * 
 * Exact structure expected by Didox API for TTN documents (docType: '041').
 */
export interface ApiTtnPayload {
  WaybillLocalType: number;
  DeliveryType: number;
  WaybillDoc: {
    WaybillNo: string;
    WaybillDate: string;
  };
  ContractDoc?: {
    ContractNo: string;
    ContractDate: string;
  };
  Consignor: {
    ConsignorTin: string;
    ConsignorName: string;
    ConsignorBranchCode: string;
    ConsignorBranchName: string;
  };
  Consignee: {
    ConsigneeTin: string;
    ConsigneeName: string;
    ConsigneeBranchCode: string;
    ConsigneeBranchName: string;
  };
  Carrier: {
    CarrierTin: string;
    CarrierName: string;
    CarrierBranchCode: string;
    CarrierBranchName: string;
  };
  FreightForwarder?: {
    FreightForwarderTin: string;
    FreightForwarderName: string;
    FreightForwarderBranchCode: string;
    FreightForwarderBranchName: string;
  };
  Client?: {
    ClientTin: string;
    ClientName: string;
    ClientBranchCode: string;
    ClientBranchName: string;
  };
  Payer?: {
    PayerTin: string;
    PayerName: string;
    PayerBranchCode: string;
    PayerBranchName: string;
  };
  TransportType: number;
  Roadway: {
    Truck: {
      RegNo: string;
      Model: string;
    };
    Trailer?: {
      RegNo: string;
      Model: string;
    };
    Driver: {
      Pinfl: string;
      FullName: string;
    };
    ProductGroups: {
      OrdNo: number;
      LoadingPoint: {
        Address: string;
        Tin: string;
        Name: string;
      };
      LoadingTrustee?: {
        Pinfl: string;
        FullName: string;
      };
      UnloadingPoint: {
        Address: string;
        Tin: string;
        Name: string;
      };
      UnloadingTrustee?: {
        Pinfl: string;
        FullName: string;
      };
      Empowerment?: {
        EmpowermentNo: string;
        EmpowermentDate: string;
        EmpowermentSeries?: string;
      };
      ProductList: {
        OrdNo: number;
        CatalogCode: string;
        CatalogName: string;
        Name: string;
        PackageCode: string;
        PackageName: string;
        Count: string;
        Amount: string;
        DeliverySum: string;
      }[];
    }[];
  };
  ResponsiblePerson: {
    Pinfl: string;
    FullName: string;
  };
  TotalDistance: string;
  DeliveryCost: string;
  TotalDeliveryCost: string;
  HasCommittent?: boolean;
  SingleSidedType?: number;
  isValid: boolean;
}

/**
 * TTN Product Group Builder
 * 
 * Nested builder for constructing product groups with loading/unloading points.
 * Used internally by TTNBuilder.addProductGroup().
 */
export class TtnProductGroupBuilder {
  private groupData: Partial<ProductGroupDraft> = {};

  /**
   * Set loading point information
   * 
   * @param point - Loading point details
   * @returns This product group builder for chaining
   * 
   * @example
   * ```typescript
   * group.loadingPoint({
   *   address: 'г. Ташкент, ул. Амира Темура, 1',
   *   tin: '123456789',
   *   name: 'ООО Склад'
   * })
   * ```
   */
  loadingPoint(point: { address: string; tin: string; name: string }): this {
    this.groupData.loadingPoint = point;
    return this;
  }

  /**
   * Set loading trustee (responsible person for loading)
   * 
   * @param trustee - Loading trustee details
   * @returns This product group builder for chaining
   * 
   * @example
   * ```typescript
   * group.loadingTrustee({
   *   pinfl: '30601851234567',
   *   fullName: 'Иванов Иван Иванович'
   * })
   * ```
   */
  loadingTrustee(trustee: { pinfl: string; fullName: string }): this {
    this.groupData.loadingTrustee = trustee;
    return this;
  }

  /**
   * Set unloading point information
   * 
   * @param point - Unloading point details
   * @returns This product group builder for chaining
   * 
   * @example
   * ```typescript
   * group.unloadingPoint({
   *   address: 'г. Самарканд, ул. Регистан, 5',
   *   tin: '987654321',
   *   name: 'ООО Получатель'
   * })
   * ```
   */
  unloadingPoint(point: { address: string; tin: string; name: string }): this {
    this.groupData.unloadingPoint = point;
    return this;
  }

  /**
   * Set unloading trustee (responsible person for unloading)
   * 
   * @param trustee - Unloading trustee details
   * @returns This product group builder for chaining
   * 
   * @example
   * ```typescript
   * group.unloadingTrustee({
   *   pinfl: '31501851234567',
   *   fullName: 'Петров Петр Петрович'
   * })
   * ```
   */
  unloadingTrustee(trustee: { pinfl: string; fullName: string }): this {
    this.groupData.unloadingTrustee = trustee;
    return this;
  }

  /**
   * Set empowerment document information
   * 
   * @param empowerment - Empowerment document details
   * @returns This product group builder for chaining
   * 
   * @example
   * ```typescript
   * group.empowerment({
   *   no: 'DOV-001',
   *   date: '2025-01-20',
   *   series: 'AAA'
   * })
   * ```
   */
  empowerment(empowerment: { no: string; date: string; series?: string }): this {
    this.groupData.empowerment = empowerment;
    return this;
  }

  /**
   * Add a product/good to this group
   * 
   * @param product - Product details
   * @returns This product group builder for chaining
   * 
   * @example
   * ```typescript
   * group.addProduct({
   *   name: 'Пшеница',
   *   catalogCode: 'WHEAT001',
   *   catalogName: 'Зерновые',
   *   packageCode: 'TON',
   *   packageName: 'тонна',
   *   count: 25,
   *   price: 2500000 // цена за тонну
   * })
   * ```
   */
  addProduct(product: TtnProductDraft): this {
    if (!this.groupData.products) {
      this.groupData.products = [];
    }
    this.groupData.products.push(product);
    return this;
  }

  /**
   * Add multiple products/goods to this group
   * 
   * @param products - Array of product details
   * @returns This product group builder for chaining
   * 
   * @example
   * ```typescript
   * group.addProducts([
   *   { name: 'Пшеница', catalogCode: 'WHEAT001', count: 25, price: 2500000, ... },
   *   { name: 'Ячмень', catalogCode: 'BARLEY001', count: 15, price: 2200000, ... }
   * ])
   * ```
   */
  addProducts(products: TtnProductDraft[]): this {
    if (!this.groupData.products) {
      this.groupData.products = [];
    }
    this.groupData.products.push(...products);
    return this;
  }

  /**
   * Build the final product group data
   * 
   * @returns Complete product group draft
   * @internal Used by TTNBuilder
   */
  build(): ProductGroupDraft {
    if (!this.groupData.loadingPoint) {
      throw new Error('Loading point is required for product group');
    }
    if (!this.groupData.unloadingPoint) {
      throw new Error('Unloading point is required for product group');
    }
    if (!this.groupData.products || this.groupData.products.length === 0) {
      throw new Error('At least one product is required for product group');
    }

    return this.groupData as ProductGroupDraft;
  }
}

/**
 * Transport Waybill (TTN) Document Builder (Production)
 * 
 * DX-friendly builder for creating transport waybill documents (docType: '041').
 * Provides fluent, chainable API that transforms to exact Didox API JSON format.
 * 
 * @example
 * ```typescript
 * const payload = builders.ttn()
 *   .waybill('TTN-001', '2025-02-07', { deliveryType: 2 })
 *   .contract('CNT-1', '2025-01-01')
 *   .consignor({ tin: '123456789', name: 'ООО Отправитель' })
 *   .consignee({ tin: '987654321', name: 'ООО Получатель' })
 *   .carrier({ tin: '555444333', name: 'ООО Перевозчик' })
 *   .transport({
 *     truck: { regNo: '01 386 EJA', model: 'KAMAZ-5320' },
 *     driver: { pinfl: '30601851234567', fullName: 'Иванов И.И.' }
 *   })
 *   .addProductGroup(group => 
 *     group
 *       .loadingPoint({ address: 'Склад №1', tin: '123456789', name: 'ООО Склад' })
 *       .unloadingPoint({ address: 'Магазин №5', tin: '987654321', name: 'ООО Магазин' })
 *       .addProduct({ name: 'Товар', catalogCode: 'GOOD001', count: 100, price: 50000, ... })
 *   )
 *   .totals({ distanceKm: 120, pricePerKm: 10000 })
 *   .responsiblePerson({ pinfl: '30601851234567', fullName: 'Иванов И.И.' })
 *   .build();
 * 
 * // Use with createDraft
 * await client.documents.createDraft('041', payload);
 * ```
 */
class TtnBuilder extends BaseDocumentBuilder<ApiTtnPayload> {
  private dxPayload: Partial<TtnDraft> = {};

  /**
   * Raw data merge (escape hatch)
   * 
   * Allows merging arbitrary JSON data directly into the API payload.
   * This overrides the base implementation to work with TTN's dual payload system.
   * 
   * @param data - Raw data to merge into the current payload
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * const payload = builder
   *   .waybill('TTN-001', '2025-02-07', { deliveryType: 2 })
   *   .consignor({ tin: '123456789', name: 'Test' })
   *   .raw({
   *     CustomField: 'special value',
   *     AdvancedSettings: { priority: 'high' }
   *   })
   *   .build();
   * ```
   */
  raw(data: Partial<ApiTtnPayload>): this {
    // Merge raw data into the base payload (for API-level overrides)
    Object.assign(this.payload, data);
    return this;
  }
  /**
   * Set waybill document information
   * 
   * @param no - Waybill number
   * @param date - Waybill date (YYYY-MM-DD format)
   * @param options - Additional waybill options
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.waybill('TTN-001', '2025-02-07', { 
   *   localType: 0, 
   *   deliveryType: 2 
   * })
   * ```
   */
  waybill(no: string, date: string, options: { localType?: 0 | 1 | 4; deliveryType: number }): this {
    this.dxPayload.waybill = {
      no,
      date,
      deliveryType: options.deliveryType,
      ...(options.localType !== undefined && { localType: options.localType })
    };
    return this;
  }

  /**
   * Set contract document information (optional)
   * 
   * @param no - Contract number
   * @param date - Contract date (YYYY-MM-DD format)
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.contract('CNT-2025-001', '2025-01-15')
   * ```
   */
  contract(no: string, date: string): this {
    this.dxPayload.contract = { no, date };
    return this;
  }

  /**
   * Set consignor (sender) organization details
   * 
   * @param consignor - Consignor organization information
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.consignor({
   *   tin: '123456789',
   *   name: 'ООО «Отправитель»',
   *   branchCode: 'MAIN',
   *   branchName: 'Головной офис'
   * })
   * ```
   */
  consignor(consignor: Party): this {
    this.dxPayload.consignor = consignor;
    return this;
  }

  /**
   * Set consignee (receiver) organization details
   * 
   * @param consignee - Consignee organization information
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.consignee({
   *   tin: '987654321',
   *   name: 'ООО «Получатель»',
   *   branchCode: 'STORE5',
   *   branchName: 'Магазин №5'
   * })
   * ```
   */
  consignee(consignee: Party): this {
    this.dxPayload.consignee = consignee;
    return this;
  }

  /**
   * Set carrier organization details
   * 
   * @param carrier - Carrier organization information
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.carrier({
   *   tin: '555444333',
   *   name: 'ООО «Транспорт»',
   *   branchCode: 'AUTO1',
   *   branchName: 'Автопарк №1'
   * })
   * ```
   */
  carrier(carrier: Party): this {
    this.dxPayload.carrier = carrier;
    return this;
  }

  /**
   * Set freight forwarder organization details (optional)
   * 
   * @param freightForwarder - Freight forwarder organization information
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.freightForwarder({
   *   tin: '111222333',
   *   name: 'ООО «Экспедитор»'
   * })
   * ```
   */
  freightForwarder(freightForwarder: Party): this {
    this.dxPayload.freightForwarder = freightForwarder;
    return this;
  }

  /**
   * Set client organization details (optional)
   * 
   * @param client - Client organization information
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.client({
   *   tin: '999888777',
   *   name: 'ООО «Клиент»'
   * })
   * ```
   */
  client(client: Party): this {
    this.dxPayload.client = client;
    return this;
  }

  /**
   * Set payer organization details (optional)
   * 
   * @param payer - Payer organization information
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.payer({
   *   tin: '777666555',
   *   name: 'ООО «Плательщик»'
   * })
   * ```
   */
  payer(payer: Party): this {
    this.dxPayload.payer = payer;
    return this;
  }

  /**
   * Set transport information
   * 
   * @param transport - Transport details including truck, trailer, and driver
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.transport({
   *   type: 1, // автомобильный
   *   truck: { 
   *     regNo: '01 386 EJA', 
   *     model: 'KAMAZ-5320' 
   *   },
   *   trailer: { 
   *     regNo: '01 387 EJB', 
   *     model: 'Прицеп-1' 
   *   },
   *   driver: { 
   *     pinfl: '30601851234567', 
   *     fullName: 'Иванов Иван Иванович' 
   *   }
   * })
   * ```
   */
  transport(transport: TtnDraft['transport']): this {
    this.dxPayload.transport = transport;
    return this;
  }

  /**
   * Add a product group with nested builder
   * 
   * @param builderFn - Function that configures the product group builder
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.addProductGroup(group => 
   *   group
   *     .loadingPoint({
   *       address: 'г. Ташкент, ул. Амира Темура, 1',
   *       tin: '123456789',
   *       name: 'ООО Склад'
   *     })
   *     .unloadingPoint({
   *       address: 'г. Самарканд, ул. Регистан, 5',
   *       tin: '987654321',
   *       name: 'ООО Магазин'
   *     })
   *     .addProduct({
   *       name: 'Пшеница',
   *       catalogCode: 'WHEAT001',
   *       catalogName: 'Зерновые',
   *       packageCode: 'TON',
   *       packageName: 'тонна',
   *       count: 25,
   *       price: 2500000
   *     })
   *     .addProduct({
   *       name: 'Ячмень',
   *       catalogCode: 'BARLEY001',
   *       catalogName: 'Зерновые',
   *       packageCode: 'TON',
   *       packageName: 'тонна',
   *       count: 15,
   *       price: 2200000
   *     })
   * )
   * ```
   */
  addProductGroup(builderFn: (builder: TtnProductGroupBuilder) => TtnProductGroupBuilder): this {
    const groupBuilder = new TtnProductGroupBuilder();
    const configuredBuilder = builderFn(groupBuilder);
    const productGroup = configuredBuilder.build();

    if (!this.dxPayload.productGroups) {
      this.dxPayload.productGroups = [];
    }
    this.dxPayload.productGroups.push(productGroup);

    return this;
  }

  /**
   * Set total distance and delivery cost calculation
   * 
   * @param totals - Distance and price per km information
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.totals({ 
   *   distanceKm: 120, 
   *   pricePerKm: 10000 // цена за км в сумах
   * })
   * ```
   */
  totals(totals: { distanceKm: number; pricePerKm: number }): this {
    this.dxPayload.totals = totals;
    return this;
  }

  /**
   * Set responsible person information
   * 
   * @param person - Responsible person details
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.responsiblePerson({
   *   pinfl: '30601851234567',
   *   fullName: 'Иванов Иван Иванович'
   * })
   * ```
   */
  responsiblePerson(person: { pinfl: string; fullName: string }): this {
    this.dxPayload.responsiblePerson = person;
    return this;
  }

  /**
   * Set additional TTN flags (optional)
   * 
   * @param flags - Optional TTN configuration flags
   * @returns This builder instance for method chaining
   * 
   * @example
   * ```typescript
   * builder.flags({ 
   *   hasCommittent: true, 
   *   singleSidedType: 1 
   * })
   * ```
   */
  flags(flags: { hasCommittent?: boolean; singleSidedType?: number }): this {
    this.dxPayload.flags = flags;
    return this;
  }

  /**
   * Build final TTN document payload
   * 
   * Transforms the DX-friendly payload into the exact Didox API JSON format.
   * Performs automatic calculations for delivery costs and product numbering.
   * 
   * @returns Complete TTN payload ready for Didox API
   * 
   * @example
   * ```typescript
   * const apiPayload = builder.build();
   * await client.documents.createDraft('041', apiPayload);
   * ```
   */
  build(): ApiTtnPayload {
    const draft = this.dxPayload as TtnDraft;

    // Validation
    if (!draft.waybill) throw new Error('Waybill information is required');
    if (!draft.consignor) throw new Error('Consignor is required');
    if (!draft.consignee) throw new Error('Consignee is required'); 
    if (!draft.carrier) throw new Error('Carrier is required');
    if (!draft.transport) throw new Error('Transport information is required');
    if (!draft.productGroups || draft.productGroups.length === 0) {
      throw new Error('At least one product group is required');
    }
    if (!draft.totals) throw new Error('Totals information is required');
    if (!draft.responsiblePerson) throw new Error('Responsible person is required');

    // Calculate totals
    const totalDeliveryCost = draft.totals.distanceKm * draft.totals.pricePerKm;

    // Transform to API format
    const apiPayload: ApiTtnPayload = {
      WaybillLocalType: draft.waybill.localType ?? 0,
      DeliveryType: draft.waybill.deliveryType,

      WaybillDoc: {
        WaybillNo: draft.waybill.no,
        WaybillDate: draft.waybill.date
      },

      ...(draft.contract && {
        ContractDoc: {
          ContractNo: draft.contract.no,
          ContractDate: draft.contract.date
        }
      }),

      Consignor: {
        ConsignorTin: draft.consignor.tin,
        ConsignorName: draft.consignor.name,
        ConsignorBranchCode: draft.consignor.branchCode ?? '',
        ConsignorBranchName: draft.consignor.branchName ?? ''
      },

      Consignee: {
        ConsigneeTin: draft.consignee.tin,
        ConsigneeName: draft.consignee.name,
        ConsigneeBranchCode: draft.consignee.branchCode ?? '',
        ConsigneeBranchName: draft.consignee.branchName ?? ''
      },

      Carrier: {
        CarrierTin: draft.carrier.tin,
        CarrierName: draft.carrier.name,
        CarrierBranchCode: draft.carrier.branchCode ?? '',
        CarrierBranchName: draft.carrier.branchName ?? ''
      },

      ...(draft.freightForwarder && {
        FreightForwarder: {
          FreightForwarderTin: draft.freightForwarder.tin,
          FreightForwarderName: draft.freightForwarder.name,
          FreightForwarderBranchCode: draft.freightForwarder.branchCode ?? '',
          FreightForwarderBranchName: draft.freightForwarder.branchName ?? ''
        }
      }),

      ...(draft.client && {
        Client: {
          ClientTin: draft.client.tin,
          ClientName: draft.client.name,
          ClientBranchCode: draft.client.branchCode ?? '',
          ClientBranchName: draft.client.branchName ?? ''
        }
      }),

      ...(draft.payer && {
        Payer: {
          PayerTin: draft.payer.tin,
          PayerName: draft.payer.name,
          PayerBranchCode: draft.payer.branchCode ?? '',
          PayerBranchName: draft.payer.branchName ?? ''
        }
      }),

      TransportType: draft.transport.type,

      Roadway: {
        Truck: {
          RegNo: draft.transport.truck.regNo,
          Model: draft.transport.truck.model
        },

        ...(draft.transport.trailer && {
          Trailer: {
            RegNo: draft.transport.trailer.regNo,
            Model: draft.transport.trailer.model
          }
        }),

        Driver: {
          Pinfl: draft.transport.driver.pinfl,
          FullName: draft.transport.driver.fullName
        },

        ProductGroups: draft.productGroups.map((group, groupIndex) => ({
          OrdNo: groupIndex + 1,

          LoadingPoint: {
            Address: group.loadingPoint.address,
            Tin: group.loadingPoint.tin,
            Name: group.loadingPoint.name
          },

          ...(group.loadingTrustee && {
            LoadingTrustee: {
              Pinfl: group.loadingTrustee.pinfl,
              FullName: group.loadingTrustee.fullName
            }
          }),

          UnloadingPoint: {
            Address: group.unloadingPoint.address,
            Tin: group.unloadingPoint.tin,
            Name: group.unloadingPoint.name
          },

          ...(group.unloadingTrustee && {
            UnloadingTrustee: {
              Pinfl: group.unloadingTrustee.pinfl,
              FullName: group.unloadingTrustee.fullName
            }
          }),

          ...(group.empowerment && {
            Empowerment: {
              EmpowermentNo: group.empowerment.no,
              EmpowermentDate: group.empowerment.date,
              ...(group.empowerment.series && {
                EmpowermentSeries: group.empowerment.series
              })
            }
          }),

          ProductList: group.products.map((product, productIndex) => {
            const amount = product.count * product.price;
            const deliverySum = Math.round((amount / 100) * draft.totals.pricePerKm);

            return {
              OrdNo: productIndex + 1,
              CatalogCode: product.catalogCode,
              CatalogName: product.catalogName,
              Name: product.name,
              PackageCode: product.packageCode,
              PackageName: product.packageName,
              Count: product.count.toString(),
              Amount: amount.toString(),
              DeliverySum: deliverySum.toString()
            };
          })
        }))
      },

      ResponsiblePerson: {
        Pinfl: draft.responsiblePerson.pinfl,
        FullName: draft.responsiblePerson.fullName
      },

      TotalDistance: draft.totals.distanceKm.toFixed(2),
      DeliveryCost: draft.totals.pricePerKm.toString(),
      TotalDeliveryCost: totalDeliveryCost.toFixed(2),

      ...(draft.flags?.hasCommittent !== undefined && {
        HasCommittent: draft.flags.hasCommittent
      }),

      ...(draft.flags?.singleSidedType !== undefined && {
        SingleSidedType: draft.flags.singleSidedType
      }),

      isValid: true
    };

    // Merge any raw overrides from base payload
    return { ...apiPayload, ...this.payload };
  }
}

/**
 * Creates a new transport waybill document builder
 * 
 * @param initial - Optional initial TTN data
 * @returns TTN builder instance
 * 
 * @example
 * ```typescript
 * const payload = client.documents.builders.ttn()
 *   .waybill('TTN-001', '2025-02-07', { deliveryType: 2 })
 *   .consignor({ tin: '123456789', name: 'ООО Отправитель' })
 *   .consignee({ tin: '987654321', name: 'ООО Получатель' })
 *   .carrier({ tin: '555444333', name: 'ООО Перевозчик' })
 *   .transport({
 *     type: 1,
 *     truck: { regNo: '01 386 EJA', model: 'KAMAZ' },
 *     driver: { pinfl: '30601851234567', fullName: 'Иванов И.И.' }
 *   })
 *   .addProductGroup(group => 
 *     group
 *       .loadingPoint({...})
 *       .unloadingPoint({...})
 *       .addProduct({...})
 *   )
 *   .totals({ distanceKm: 120, pricePerKm: 10000 })
 *   .responsiblePerson({ pinfl: '...', fullName: '...' })
 *   .build();
 * ```
 */
export const ttn: DocumentBuilderFactory<ApiTtnPayload> = (initial?) => 
  new TtnBuilder(initial);