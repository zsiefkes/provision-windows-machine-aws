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

import { EncryptedMachine } from "../src/EncryptedMachine";

describe("Encrypted machines", function checkEncryptedMachine() {
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

  var machine: EncryptedMachine;

  before(function createInstance() {
    machine = new EncryptedMachine("noFixedIp", {
      amiId: "ami-id",
      subnetId: "subnet-123",
      autoStartStop: false,
      instanceType: "t3a.nano",
      keyArn: "arn:key:id",
      iamInstanceProfileId: "iam-a-profile"
    }, {});
  });

  describe("the virtual machine", function checkCommonConfig() {
    it("should exist", async function instanceExists() {
      expect(machine.instance.id).to.exist;
    });

    it("should be a large ec2 instance", async function instanceSize() {
      return expect(machine.instance.instanceType.promise()).to.eventually.eq("t3.large");
    });

    it("should be in region ap-southeast-2", async function instanceRegion() {
      return;
    });

    it("should have an encrypted file system", async function encryptedAtRest() {
      return expect(machine.instance.rootBlockDevice.encrypted.promise()).to.eventually.be.true;
    });

    it("should be in a public subnet", async function publicSubnet() {
      return;
    });



    it("should output an IP address", async function outputIpAddress() {
      return;
    });
  });
});
