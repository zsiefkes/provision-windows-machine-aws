import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// import * as awsx from "@pulumi/awsx";

const buildConfig = require("./build-config.json");

// Set parameters
const instanceType = "t3.large";

// Base Windows AMI (copied from EC2ImageBuilder.ts). This is used in an image recipe
const windowsBaseAmiResult = aws.ec2.getAmi({
  filters: [
    { name: "architecture", values: ["x86_64"], },
    { name: "platform", values: ["windows"], },
    { name: "image-type", values: ["machine"] },
    { name: "state", values: ["available"] },
    { name: "virtualization-type", values: ["hvm"], },
  ],
  mostRecent: true,
  owners: ["amazon"],
  nameRegex: "^Windows_Server-2019-English-Full-Base-\\d{4}\\.\\d{2}\\.\\d{2}"
},);

const web = new aws.ec2.Instance("windows-machine", {
  ami: windowsBaseAmiResult.then(windowsBaseAmiResult => windowsBaseAmiResult.id),
  instanceType: instanceType
});