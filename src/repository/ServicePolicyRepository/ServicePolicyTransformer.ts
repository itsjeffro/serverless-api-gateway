class ServicePolicyTransformer {
  static toObject(item: any) {
    return {
      service_name_version: item.service_name_version ? item.service_name_version.S : "",
      policy: item.policy ? JSON.parse(item.policy.S) : {},
    };
  }
}

export default ServicePolicyTransformer;
