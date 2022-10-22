export const ecr = (process: NodeJS.Process) =>
  ({
    repository: {
      repositoryArn: process.env.REPOSITORY_ARN,
      registryId: process.env.REGISTRY_ID,
      repositoryName: 'event-schedule',
      repositoryUri: process.env.REPOSITORY_URI,
      createdAt: 1666450971.0,
      imageTagMutability: 'MUTABLE',
      imageScanningConfiguration: {
        scanOnPush: false,
      },
      encryptionConfiguration: {
        encryptionType: 'AES256',
      },
    },
  } as const);
