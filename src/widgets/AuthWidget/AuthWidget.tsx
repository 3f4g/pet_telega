import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/shared/ui/ui/button';

interface IAuthWidgetProps {
  onLogin: () => void;
}

export function AuthWidget({ onLogin }: IAuthWidgetProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Sign in with your Google account</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" onClick={onLogin}>
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
