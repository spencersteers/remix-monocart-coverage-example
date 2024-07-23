import { json } from '@remix-run/node';

// action is excluded from client bundle
export function action() {
  return json({ hello: 'world' });
}

export default function Test() {
  return (
    <h1>Test</h1>
  );
}