const app = require("express")();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use((req, res, next) =>
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? req.headers.origin,
  })(req, res, next)
);

app.use(cookieParser());


const cookie_config = {
    name: "admin-session",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true, // es true por defecto
    secure: true // process.env.NODE_ENV === "production",
  }

app.all("*", (req, res, next) => {
  res.cookie('cris-auth-cookie','token', {
    path: "/",
    sameSite:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_SAMESITE
        : "Strict",
    domain:
      process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : "",
    maxAge: cookie_config.maxAge, // 24 hours
    httpOnly: cookie_config.httpOnly, // es true por defecto
    secure: cookie_config.secure,
  });

  res.json({
    origin: req.headers.origin,
    cookies: req.cookies,
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
