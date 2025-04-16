import { Dart } from "../models/dart";

export function DartThrow(props: { dart: Dart | undefined }) {
  const dart = props.dart
    ? `${props.dart.ring ?? ""}${props.dart.score}`
    : "\u00A0";
  return <h5 className="text-2xl">{dart}</h5>;
}
