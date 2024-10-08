from cryoet_data_portal import Client, Run, Tomogram

# Instantiate a client, using the data portal GraphQL API by default
client = Client()

# runs_list = Run.find(client, query_filters=[Run.name.ilike("%TS%"), Run.tomogram_voxel_spacings.tomograms.size_x > 900])
runs_list = Run.find(client)
for run in runs_list:
    print(run.name)
    for vs in run.tomogram_voxel_spacings:
        # for tomo in vs.tomograms:
        # These tomograms may or may not be > 900 voxels wide because I didn't add another filter above!
        tomos = Tomogram.find(
            client,
            query_filters=[
                Tomogram.tomogram_voxel_spacing.id == vs.id,
            ],
        )
        for tomo in tomos:
            print(tomo.to_dict())
    print(run.to_dict())
