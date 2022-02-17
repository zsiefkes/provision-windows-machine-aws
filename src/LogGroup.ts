import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export class LogGroup extends pulumi.ComponentResource {
  constructor(name: string, args: any) {
    super(name, args);
  };
}
