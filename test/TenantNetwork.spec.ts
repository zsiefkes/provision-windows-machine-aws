import "mocha";
import * as chaiAsPromised from "chai-as-promised";
import { expect, use as chaiWillUse } from "chai";
chaiWillUse(chaiAsPromised);

import * as pulumi from "@pulumi/pulumi"
declare module "@pulumi/pulumi" {
  export interface OutputInstance<T> {
    promise(withUnknowns?: boolean): Promise<T>;
  }
}

import { TenantNetwork } from "../src/TenantNetwork";

describe("TenantNetwork", function checkTenantNetwork() {
  before(function createStubInstance() {
    pulumi.runtime.setMocks({
      newResource: (args: pulumi.runtime.MockResourceArgs): { id: string, state: Record<string, any> } => {
        let state = {
          ...args.inputs,
          id: `${args.inputs.name ?? args.name}_id`,
          name: args.inputs.name ?? args.name,
          arn: `aws:arn:ap-southeast-2:${args.type}:${args.name}:${args.name}_id` // The ARN value doesn"t matter. It just needs a value to prove that it has been created.
        };

        switch (args.type) {
          case "aws:ec2/instance:Instance":
            state.status = "stopped";
        };

        return {
          id: state.id,
          state: state
        };
      },
      call: (args: pulumi.runtime.MockCallArgs): Record<string, any> => {
        return args.inputs;
      }
    });
  });

  var tenantNetwork: TenantNetwork;

  before(function createTenantNetwork() {
    tenantNetwork = new TenantNetwork("name", "args");
  });

  describe("VPC", function checkVPC() {
    it("should exist", async function vpcExists() {
    });

    it("should not allow public ingress", async function publicIngress() {
    });

    it("should allow public egress", async function publicEgress() {
    });
  });

  describe("Security Group", function checkSecurityGroupConfig() {
    it("should allow RDP ingress", async function instanceExists() {
    });

    it("should allow HTTPS ingress", async function instanceExists() {
    });

    it("should allow HTTPS ingress", async function instanceExists() {
    });
  });
});
