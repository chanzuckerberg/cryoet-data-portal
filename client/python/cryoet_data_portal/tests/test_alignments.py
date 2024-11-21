from cryoet_data_portal import TiltSeries


def test_alignment_to_ts(client) -> None:
    # make sure the relationship between tiltseries and alignments
    # works in both directions.
    ts = TiltSeries.find(client, [TiltSeries.run.name == "RUN1"])
    assert len(ts) == 1
    ts_alignments = ts[0].alignments
    assert len(ts_alignments) == 1
    assert ts_alignments[0].tiltseries.id == ts[0].id
