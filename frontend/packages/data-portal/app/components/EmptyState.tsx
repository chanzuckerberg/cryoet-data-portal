import { useTranslation } from 'react-i18next'

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message }: EmptyStateProps) {
  const { t } = useTranslation()

  return (
    <div className="text-center py-8 text-sds-color-semantic-text-base-secondary">
      {message ?? t('noDataAvailable')}
    </div>
  )
}
