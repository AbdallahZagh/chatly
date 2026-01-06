<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Chatly API",
 *      description="API Documentation for Chatly Backend",
 *      @OA\Contact(
 *          email="support@chatly.com"
 *      ),
 *      @OA\License(
 *          name="Apache 2.0",
 *          url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *      )
 * )
 *
 * @OA\Server(
 *      url=L5_SWAGGER_CONST_HOST,
 *      description="Demo API Server"
 * )
 *
 * @OA\Get(
 *     path="/api/health",
 *     tags={"Health"},
 *     summary="Health Check",
 *     description="Basic health check endpoint to verify API is running",
 *     @OA\Response(response="200", description="API is active")
 * )
 */
abstract class Controller
{
    //
}
