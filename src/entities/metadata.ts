export interface Metadata {
    key: string;
    value: string;
}

export interface SoftwareModuleMetadata extends Metadata {
  /** When true, hawkBit sends this metadata entry to the device in the DDI deployment response. */
  targetVisible?: boolean;
}
