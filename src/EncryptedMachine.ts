import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as tls from "@pulumi/tls";

export interface EncryptedMachineArgs {
  amiId: pulumi.Input<string>,
  keyArn?: pulumi.Input<string>,
  subnetId: pulumi.Input<string>,
  iamInstanceProfileId: pulumi.Input<string>,
  vpcSecurityGroupIds?: pulumi.Input<string>[],
  autoStartStop?: Boolean,
  instanceType: pulumi.Input<aws.ec2.InstanceType>,
  volumeSizeGbs?: number,
  tags?: { [key: string]: string; },
  privateIp?: pulumi.Input<string>,
  userData?: pulumi.Input<string>
}

export class EncryptedMachine extends pulumi.ComponentResource {
  private readonly name: string;
  private readonly opts: Object;
  public readonly keyPair: aws.ec2.KeyPair;
  public readonly instance: aws.ec2.Instance;
  public readonly privateKey: pulumi.Output<string>;

  private parentOpts(parent: pulumi.Resource): any {
    return { ...this.opts, parent: parent };
  }

  constructor(name: string, args: EncryptedMachineArgs, opts: pulumi.ComponentResourceOptions = {}) {
    super("iqa:aws:ec2:instance", name, args, opts);
    this.name = name;
    this.opts = opts;

    const tlsKey = new tls.PrivateKey(name, {
      algorithm: "RSA"
    }, { parent: this });
    this.privateKey = tlsKey.privateKeyPem;

    this.keyPair = new aws.ec2.KeyPair(name, {
      publicKey: tlsKey.publicKeyOpenssh,
      keyNamePrefix: name
    }, this.parentOpts(tlsKey));

    this.instance = new aws.ec2.Instance(name, this.instanceArgs(args, this.keyPair), {
      ...this.parentOpts(this),
      deleteBeforeReplace: (args.privateIp != undefined), // If we're reusing the same IP address, then we have to delete the instance first.
      ignoreChanges: ["associatePublicIpAddress"] // To prevent destroying core's openvpnas. TODO: remove this and create a new openvpnas. Ensure everyone is prepared.
    });
    this.registerOutputs();
  }

  private instanceArgs(args: EncryptedMachineArgs, keyPair: aws.ec2.KeyPair): aws.ec2.InstanceArgs {
    return {
      associatePublicIpAddress: false,
      keyName: keyPair.keyName,
      tags: {
        ...args.tags,
        AutoStartStop: args.autoStartStop?.toString() || 'true'
      },
      rootBlockDevice: {
        encrypted: true,
        kmsKeyId: args.keyArn,
        volumeType: "gp3",
        volumeSize: args.volumeSizeGbs
      },
      volumeTags: {
        "Name": this.name
      },
      instanceType: args.instanceType,
      ami: args.amiId,
      subnetId: args.subnetId,
      iamInstanceProfile: args.iamInstanceProfileId,
      vpcSecurityGroupIds: args.vpcSecurityGroupIds,
      privateIp: args.privateIp,
      userData: args.userData
    };
  }
}
