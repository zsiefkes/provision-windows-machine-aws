import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as tls from "@pulumi/tls";

export class TenantNetwork extends pulumi.ComponentResource {
  constructor(name: string, args: any) {
    super(name, args);
  };
}
