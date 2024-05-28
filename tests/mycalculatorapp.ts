import { it } from "mocha";

const assert = require("assert");
const anchor = require("@coral-xyz/anchor");
const { SystemProgram } = anchor.web3;

describe("mycalculatorapp", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const calculator = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Mycalculatorapp;

  /*---------- TEST CREATE CALCULATOR ----------*/
  it("Creates a calculator", async () => {
    await program.rpc.create("Welcome to Solana Nash", {
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator],
    });

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    assert.ok(account.greeting === "Welcome to Solana Nash");
  });

  /*---------- TEST CALCULATOR ADDITION ----------*/
  it("Adds two numbers", async () => {
    await program.rpc.add(new anchor.BN(20), new anchor.BN(13), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const actualAnswer = new anchor.BN(20 + 13);
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(actualAnswer));
  });

  /*---------- TEST CALCULATOR SUBTRACTION ----------*/
  it("Subtrcts two numbers", async () => {
    await program.rpc.subtract(new anchor.BN(54), new anchor.BN(4), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const actualAnswer = new anchor.BN(50);
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(actualAnswer));
  });

  /*---------- TEST CALCULATOR MULTIPLICATION ----------*/
  it("Multiplies two numbers", async () => {
    await program.rpc.multiply(new anchor.BN(3), new anchor.BN(5), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const actualAnswer = new anchor.BN(15);
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(actualAnswer));
  });

  /*---------- TEST CALCULATOR DIVISION ----------*/
  it("Divides two numbers", async () => {
    await program.rpc.divide(new anchor.BN(33), new anchor.BN(7), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const actualAnswer = new anchor.BN(4);
    const actualRemainder = new anchor.BN(5);
    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );

    assert.ok(account.result.eq(actualAnswer));
    assert.ok(account.remainder.eq(actualRemainder));
  });
});
