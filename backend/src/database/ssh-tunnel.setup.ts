/* eslint-disable @typescript-eslint/no-unsafe-call */
import { readFileSync } from "fs";
import { createTunnel } from "tunnel-ssh";

export async function createSSHTunnel(srcAddr = "localhost", srcPort = 5432) {
  console.log("createSSHTunnel...");

  const tunnelOptions = {
    autoClose: true,
  };
  const serverOptions = {
    port: srcPort,
  };
  const sshOptions = {
    host: "54.255.7.89",
    port: 22,
    username: "ec2-user",
    privateKey: readFileSync(`${__dirname}/../../../nexus-bastion.pem`),
  };
  const forwardOptions = {
    srcAddr: srcAddr,
    srcPort: srcPort,
    dstAddr:
      "rds-cluster.cluster-cp4ms4y8cdu0.ap-southeast-1.rds.amazonaws.com",
    dstPort: 5432,
  };
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [server, client] = await createTunnel(
      { autoClose: true, reconnectOnError: true },
      { host: "localhost", port: 5432 },
      sshOptions,
      forwardOptions,
    );
    console.log("server: ", server);
    console.log("client: ", client);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === "EADDRINUSE") {
      // Assume port is uniquely used by SSH tunnel, so existing connection can be reused
      console.log(`Returning existing SSH tunnel on ${srcAddr}:${srcPort}.`);
      return { srcAddr, srcPort };
    } else {
      throw error;
    }
  }
  console.log(`SSH tunnel successfully created on ${srcAddr}:${srcPort}.`);
  return { srcAddr, srcPort };
}
