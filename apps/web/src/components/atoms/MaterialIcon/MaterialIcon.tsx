type Props = { name: string; className?: string }

export function MaterialIcon({ name, className = '' }: Props) {
  return <span aria-hidden className={`material-icons ${className}`}>{name}</span>
}
