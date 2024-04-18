import { clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
 
const protectderRoutes = createRouteMatcher([
    '/',
    '/upcoming',
    '/previous',
    '/recordings',
    '/personal-room',
    '/meeting(.*)'
])

export default clerkMiddleware((auth, req) => {
    if(protectderRoutes(req)) auth().protect();
});
 
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", "/" ,"/(api|trpc)(.*)"
  ]
};