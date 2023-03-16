function getUserIdFromCookie(req, res, next) {
    const loginCookie = req.cookies.loginCookie;
    if (loginCookie) {
      try {
        const userData = JSON.parse(loginCookie);
        req.userId = userData.userId;
      } catch (error) {
        console.error("Error parsing loginCookie:", error);
      }
    }
    next();
  }

  module.exports = { getUserIdFromCookie}