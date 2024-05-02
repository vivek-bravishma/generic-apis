// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";

export default function (CobrowseUser) {
	let module = {};

	let accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "mhro secrete";
	let accessTokenExp = process.env.ACCESS_TOKEN_EXPIRY || "10s";
	let refreshTokenSecret =
		process.env.REFRESH_TOKEN_SECRET || "mhro secrete again";
	let refreshTokenExp = process.env.REFRESH_TOKEN_EXPIRY || "40s";

	// jwt auth api services
	module.logout = async function (email) {
		// remove/invalidate refreshToken from db
		let user = await CobrowseUser.findOneAndUpdate(
			{ email },
			{ refreshToken: null }
		);

		return user;
	};

	module.login = async function (email, password) {
		// auth check with db
		let user = await CobrowseUser.findOne({ email });

		if (!user || user.password !== password) {
			throw new Error("Invalid Credentials");
		}

		let tokenData = {
			name: user.name,
			email,
			organizationId: user.organizationId,
		};

		const accessToken = generateAccessToken(
			tokenData,
			accessTokenSecret,
			accessTokenExp
		);
		const refreshToken = generateAccessToken(
			tokenData,
			refreshTokenSecret,
			refreshTokenExp
		);

		return {
			accessToken,
			refreshToken,
			user,
		};

		// save refreshToken in db
	};

	module.verifyJWT = function (payload, isAccess = false) {
		try {
			const secret = isAccess ? accessTokenSecret : refreshTokenSecret;
			console.log("secret===> ", secret);
			const decoded = jwt.verify(payload, secret);
			return { payload: decoded, expired: false };
		} catch (error) {
			return {
				payload: null,
				expired: error.message.includes("jwt expired"),
			};
		}
	};

	module.signJwt = function (payload, isAccess = false) {
		const secret = isAccess ? accessTokenSecret : refreshTokenSecret;
		const expiry = isAccess ? accessTokenExp : refreshTokenExp;
		console.log("payload==> ", payload, isAccess, secret, expiry);
		return generateAccessToken(payload, secret, expiry);
	};

	return module;
}

function generateAccessToken(payload, secret, expiry) {
	return jwt.sign(payload, secret, {
		expiresIn: expiry,
	});
}
