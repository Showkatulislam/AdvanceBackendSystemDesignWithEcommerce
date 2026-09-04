import type { Request, Response } from "express";
import { authService } from "./auth.service.js";
import sendResponse from "../../shared/utils/sendResponse.js";
import { refreshTokenCookieOptions } from "../../config/cookie.js";
import { AppError } from "../../errors/AppError.js";

const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User registered successfully.",
    data: result,
  });
};

const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  res.cookie(
    "refreshToken",
    result.refreshToken,
    refreshTokenCookieOptions
  )
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Login successful",
    data:{
      user:result.user,
      accessToken:result.accessToken
    },
  });
};

const refreshAccessToken = async(req:Request,res:Response)=>{
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken)

  if(!refreshToken){
    throw new AppError(401,"Refresh token is required.")
  }

  const result = await authService.refreshAccessToken(refreshToken);


  res.cookie("refreshToken",result.refreshToken,refreshTokenCookieOptions);
  sendResponse(res,{
    success:true,
    statusCode:200,
    message:"Access token refreshed successfully.",
    data:result
  })

}

export const authController = {
  register,
  login,
  refreshAccessToken
};
