async function createSlackPayload({ prNumber, passed, runId }) {
  // Get changelog from main directly so we can get latest entry in the changelog.
  const changelogResponse = await fetch(
    'https://raw.githubusercontent.com/chanzuckerberg/cryoet-data-portal/main/frontend/CHANGELOG.md'
  )
  const changelog = await changelogResponse.text()
  const [, version, date] = /## \[(.*)\]\(.*\) \((.*)\)/.exec(changelog)
  const changelogHash = `${version.replaceAll('.', '')}-${date}`

  return JSON.stringify({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Data Portal *v${version}* ${
            passed
              ? 'was deployed successfully :blobtada:'
              : 'deploy failed! :blob-sad:'
          }`,
        },
      },

      {
        type: 'rich_text',
        elements: [
          {
            type: 'rich_text_list',
            style: 'bullet',
            elements: [
              // Only show changelog if deployment is successful
              ...(passed
                ? [
                    {
                      type: 'rich_text_section',
                      elements: [
                        {
                          type: 'link',
                          url: `https://github.com/chanzuckerberg/cryoet-data-portal/blob/main/frontend/CHANGELOG.md#${changelogHash}`,
                          text: 'Changelog',
                        },
                      ],
                    },
                  ]
                : []),

              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'link',
                    url: `https://github.com/chanzuckerberg/cryoet-data-portal/pull/${prNumber}`,
                    text: 'Release PR',
                  },
                ],
              },

              {
                type: 'rich_text_section',
                elements: [
                  {
                    type: 'link',
                    url: `https://github.com/chanzuckerberg/cryoet-data-portal/actions/runs/${runId}`,
                    text: 'GitHub Run',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  })
}

module.exports = createSlackPayload
