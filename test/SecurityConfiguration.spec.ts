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

import { SecurityConfiguration } from "../src/SecurityConfiguration";

describe("Security config", function checkEncryptedMachine() {
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

  var securityConfig: SecurityConfiguration;

  before(function createInstance() {
    securityConfig = new SecurityConfiguration();
  });

  describe("The security configuration", function checkCommonConfig() {
    it("should contain a cloudwatch log group", async function instanceExists() {
      return;
    });

    describe("The Security Group", function checkSecurityGroupConfig() {
      it("should allow RDP ingress", async function instanceExists() {
        return;
      });

      it("should allow HTTPS ingress", async function instanceExists() {
        return;
      });

      it("should allow HTTPS ingress", async function instanceExists() {
        return;
      });
    });

    it("should contain a security group", async function instanceExists() {
      return;
    });

    describe("The Security Group", function checkSecurityGroupConfig() {
      it("should allow RDP ingress", async function instanceExists() {
        return;
      });

      it("should allow HTTPS ingress", async function instanceExists() {
        return;
      });

      it("should allow HTTPS ingress", async function instanceExists() {
        return;
      });

    });
  });
});
