const hre = require("hardhat");
const fs = require("fs");

const uniFactory = require("../artifacts/contracts/interfaces/IUniswapV2Factory.sol/IUniswapV2Factory.json");
const uniRouter = require("../artifacts/contracts/interfaces/IUniswapV2Router.sol/IUniswapV2Router.json");
const addresses = require("../addresses.json");

const tAddr = "0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7";

const poolTokens = [
  ["0x2E4bF93BdEd3236D0719aa3ceB43932f279EFe1F", 20, 0], //WOOL
  ["0x6F0F0610Bb9441d53EADB52067b3Fd45c2c75963", 20, 0], //WEED
  ["0x90ad9988e7050Db30829164b8E9837A351654863", 20, 0], //MILK
  ["0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83", 100, 30], //WFTM
  ["0x04068da6c83afcfa0e13ba15a6696662335d5b75", 100, 50], //USDC
  ["0x049d68029688eabf473097a2fc38ef61633a3c7a", 100, 50], //fUSDT
  ["0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e", 100, 50], //DAI
  ["0x82f0b8b456c1a451378467398982d4834b6829c1", 100, 50], //MIM
  ["0x74b23882a30290451A17c44f4F05243b6b58C76d", 100, 50], //WETH
  ["0x321162Cd933E2Be498Cd2267a90534A804051b11", 100, 50], //WBTC  ID 10
  ["0x911da02C1232A3c3E1418B834A311921143B04d7", 50, 30], //weve
  ["0xc165d941481e68696f43EE6E99BFB2B23E0E3114", 50, 30], //OXD
  ["0xa48d959AE2E88f1dAA7D5F611E01908106dE7598", 50, 30], //xBOO
  ["0x5Cc61A78F164885776AA610fb0FE1257df78E59B", 50, 30], //Spirit
  ["0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7", 50, 30], //tomb  15
  ["0x7a6e4E3CC2ac9924605DCa4bA31d1831c84b44aE", 50, 30], //2omb
  ["0x14DEf7584A6c52f470Ca4F4b9671056b22f4FfDE", 50, 30], //3omb
  ["0x7eC94C4327dC757601B4273cD67014d7760Be97E", 50, 30], //grim
  ["0x8F9bCCB6Dd999148Da1808aC290F2274b13D7994", 50, 30], //summit 19
  ["0xC5e2B037D30a390e62180970B3aa4E91868764cD", 50, 30], //tarot
  ["0x85dec8c4B2680793661bCA91a8F129607571863d", 50, 30], //brush 21
  ["0xF24Bcf4d1e507740041C9cFd2DddB29585aDCe1e", 50, 30], //beet
  ["0xE992bEAb6659BFF447893641A378FbbF031C5bD6", 50, 30], //wigo
];

async function main() {
  console.log(addresses);
  const signer = (await ethers.getSigners())[0];
  const startTime = 1645272000; //Saturday, 19 February 2022 20:00:00 GMT+08:00

  const factoryAddr = "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3";
  const routerAddr = "0xF491e7B69E4244ad4002BC14e878a34207E38c29";

  const factory = new ethers.Contract(factoryAddr, uniFactory.abi);
  const router = new ethers.Contract(routerAddr, uniRouter.abi);

  const Tomb = await ethers.getContractFactory("Tomb");
  const tomb = await Tomb.deploy(
    0,
    "0x0000000000000000000000000000000000000000"
  );
  await tomb.deployed();
  console.log("Tomb Address:", tomb.address);

  addresses.tomb = tomb.address
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));

  await tomb.approve(routerAddr, "999999999999999999999999999999");

  // create pair
  // const DummyToken = await ethers.getContractFactory("DummyToken");
  // const dummyToken = await DummyToken.deploy();
  // await dummyToken.deployed();
  // console.log("Dummy Token Address:", dummyToken.address);
  // await (
  //   await dummyToken.mint(signer.address, "1000000000000000000000")
  // ).wait();
  // await (
  //   await dummyToken.approve(routerAddr, "999999999999999999999999999999")
  // ).wait();
  await (await factory.connect(signer).createPair(tAddr, tomb.address)).wait();
  await (
    await router
      .connect(signer)
      .addLiquidity(
        tAddr,
        tomb.address,
        "1000",
        "10000",
        "1000",
        "10000",
        signer.address,
        "9999999999999"
      )
  ).wait();

  const pair = await factory.connect(signer).getPair(tAddr, tomb.address);
  console.log("pair:", pair);
  addresses.pair = pair
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));

  const TBond = await ethers.getContractFactory("TBond");
  const tBond = await TBond.deploy();
  await tBond.deployed();
  console.log("TBond Address:", tBond.address);
  addresses.tBond = tBond.address
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));

  const TShare = await ethers.getContractFactory("TShare");
  const tShare = await TShare.deploy(
    startTime + 86400 * 2,
    signer.address,
    signer.address
  );
  await tShare.deployed();
  console.log("TShare Address:", tShare.address);
  addresses.tShare = tShare.address
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));

  const Oracle = await ethers.getContractFactory("Oracle");
  const oracle = await Oracle.deploy(pair, 21600, startTime + 86400 * 2);
  await oracle.deployed();
  console.log("oracle Address:", oracle.address);
  addresses.oracle = oracle.address
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));

  console.log("setting Tomb oracle...");
  console.log(
    "status ",
    (await (await tomb.setTombOracle(oracle.address)).wait()).status
  );

  const TombGenesisRewardPool = await ethers.getContractFactory(
    "TombGenesisRewardPool"
  );
  const genesisPool = await TombGenesisRewardPool.deploy(
    tomb.address,
    startTime
  );
  await genesisPool.deployed();
  console.log("genesisPool Address:", genesisPool.address);
  addresses.genesisPool = genesisPool.address
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));
  console.log("adding genesis pool...");
  console.log(
    "status",
    (await (await genesisPool.add(1000, pair, true, 0, 0)).wait()).status
  );

  const TShareRewardPool = await ethers.getContractFactory("TShareRewardPool");
  const tShareRewardPool = await TShareRewardPool.deploy(
    tShare.address,
    startTime + 86400 * 2
  );
  await tShareRewardPool.deployed();
  console.log("tShareRewardPool Address:", tShareRewardPool.address);
  addresses.tShareRewardPool = tShareRewardPool.address
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));
  console.log("adding tshare reward pool...");
  console.log(
    "status",
    (await (await tShareRewardPool.add(25000, pair, true, 0)).wait()).status
  );

  console.log("distributing tomb...");
  console.log(
    "status ",
    (await (await tomb.distributeReward(genesisPool.address)).wait()).status
  );

  console.log("distributing tshare...");
  console.log(
    "status ",
    (await (await tShare.distributeReward(tShareRewardPool.address)).wait())
      .status
  );

  // TODO: add pool for pool

  const Masonry = await ethers.getContractFactory("Masonry");
  const masonry = await Masonry.deploy();
  await masonry.deployed();
  console.log("masonry Address:", masonry.address);
  addresses.masonry = masonry.address
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));

  const Treasury = await ethers.getContractFactory("Treasury");
  const treasury = await Treasury.deploy();
  await treasury.deployed();
  console.log("treasury Address:", treasury.address);
  addresses.treasury = treasury.address
  fs.writeFileSync('./addresses.json', JSON.stringify(addresses, null, 4));

  //init
  console.log("init tresury...");
  console.log(
    "status ",
    (
      await (
        await treasury.initialize(
          tomb.address,
          tBond.address,
          tShare.address,
          oracle.address,
          masonry.address,
          genesisPool.address,
          startTime + 86400 * 2
        )
      ).wait()
    ).status
  );

  console.log("init masonry...");
  console.log(
    "status ",
    (
      await (
        await masonry.initialize(tomb.address, tShare.address, treasury.address)
      ).wait()
    ).status
  );

  console.log("tomb transferOperator...");
  console.log(
    "status ",
    (await (await tomb.transferOperator(treasury.address)).wait()).status
  );
  console.log("tbond transferOperator...");
  console.log(
    "status ",
    (await (await tBond.transferOperator(treasury.address)).wait()).status
  );

  console.log("tShare transferOperator...");
  console.log(
    "status ",
    (await (await tShare.transferOperator(treasury.address)).wait()).status
  );

  console.log("setting masonry operator...");
  console.log(
    "status ",
    (await (await masonry.setOperator(treasury.address)).wait()).status
  );
  for (let i = 0; i < poolTokens.length; i++) {
    console.log(
      "index:",
      i,
      "Status",
      (
        await (
          await genesisPool.add(
            poolTokens[i][1],
            poolTokens[i][0],
            false,
            0,
            poolTokens[i][2]
          )
        ).wait()
      ).status
    );
  }

  await hre.run("verify:verify", {
    address: addresses.tomb,
    constructorArguments: [0, "0x0000000000000000000000000000000000000000"],
  });

  await hre.run("verify:verify", {
    address: addresses.tBond,
    constructorArguments: [],
  });

  await hre.run("verify:verify", {
    address: addresses.tShare,
    constructorArguments: [
      startTime + 86400 * 2,
      signer.address,
      signer.address,
    ],
  });

  await hre.run("verify:verify", {
    address: addresses.oracle,
    constructorArguments: [addresses.pair, 21600, startTime + 86400 * 2],
  });

  try {
    await hre.run("verify:verify", {
      address: addresses.genesisPool,
      constructorArguments: [addresses.tomb, startTime],
    });
  } catch (e) {
    console.error(e);
  }
  try {
    await hre.run("verify:verify", {
      address: addresses.tShareRewardPool,
      constructorArguments: [addresses.tShare, startTime + 86400 * 2],
    });
  } catch (e) {
    console.error(e);
  }

  try {
    await hre.run("verify:verify", {
      address: addresses.masonry,
      constructorArguments: [],
    });
  } catch (e) {
    console.error(e);
  }

  try {
    await hre.run("verify:verify", {
      address: addresses.treasury,
      constructorArguments: [],
    });
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
