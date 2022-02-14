import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
// import * as awsx from "@pulumi/awsx";

const buildConfig = require("./build-config.json");

// Base Windows AMI (copied from EC2ImageBuilder.ts). This is used in an image recipe
const windowsBaseAmiResult = pulumi.output(aws.ec2.getAmi({
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
},));

// Create test build component
const testBuildComponent = new aws.imagebuilder.Component(
  "testTrivialBuildComponent",
  {
      platform: "Windows",
      version: "0.0.1",
      data: JSON.stringify(buildConfig)
  }
);

// Create Image Recipe
const imageRecipe= new aws.imagebuilder.ImageRecipe(`test-image-recipe`, {
  parentImage: windowsBaseAmiResult.imageId,
  components: [{
    componentArn: testBuildComponent.arn
  }],
  version: "0.0.1"
}, { deleteBeforeReplace: true });