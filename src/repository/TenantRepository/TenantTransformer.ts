class TenantTransformer {
  static toObject(item: any) {
    return {
      tenant_name: item.tenant_name ? item.tenant_name.S : "",
      full_name: item.full_name ? item.full_name.S : "",
      created_at: item.created_at ? parseInt(item.created_at.N) : 0,
      updated_at: item.updated_at ? parseInt(item.updated_at.N) : 0,
    };
  }
}

export default TenantTransformer;
