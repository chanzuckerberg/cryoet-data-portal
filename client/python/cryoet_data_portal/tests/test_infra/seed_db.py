"""
Populate the database with mock data for local development
"""

import factory.random
from platformics.database.connect import init_sync_db
from platformics.settings import CLISettings
from platformics.test_infra.factories.base import FileFactory, SessionStorage
from test_infra.factories.alignment import AlignmentFactory
from test_infra.factories.annotation import AnnotationFactory
from test_infra.factories.annotation_author import AnnotationAuthorFactory
from test_infra.factories.annotation_file import AnnotationFileFactory
from test_infra.factories.annotation_shape import AnnotationShapeFactory
from test_infra.factories.dataset import DatasetFactory
from test_infra.factories.dataset_author import DatasetAuthorFactory
from test_infra.factories.dataset_funding import DatasetFundingFactory
from test_infra.factories.deposition import DepositionFactory
from test_infra.factories.deposition_author import DepositionAuthorFactory
from test_infra.factories.run import RunFactory
from test_infra.factories.tiltseries import TiltseriesFactory
from test_infra.factories.tomogram import TomogramFactory
from test_infra.factories.tomogram_author import TomogramAuthorFactory
from test_infra.factories.tomogram_voxel_spacing import (
    TomogramVoxelSpacingFactory,
)


def use_factoryboy() -> None:
    """
    Use factoryboy to create mock data
    """
    settings = CLISettings.model_validate({})
    app_db = init_sync_db(settings.SYNC_DB_URI)
    session = app_db.session()
    SessionStorage.set_session(session)
    factory.random.reseed_random(1234567)

    # create some datasets with multiple runs
    dep1 = DepositionFactory(id=99999)
    dep2 = DepositionFactory(id=88888)

    DepositionAuthorFactory.create(deposition=dep1, author_list_order=1)
    DepositionAuthorFactory.create(deposition=dep1, author_list_order=2)
    DepositionAuthorFactory.create(deposition=dep2, author_list_order=1)
    DepositionAuthorFactory.create(deposition=dep2, author_list_order=2)
    DepositionAuthorFactory.create(deposition=dep2, author_list_order=3)

    ds1 = DatasetFactory(
        id=20001,
        deposition=dep1,
        s3_prefix="s3://test-public-bucket/20001/",
        https_prefix="http://localhost:4444/20001/",
    )
    ds2 = DatasetFactory(
        id=20002,
        deposition=dep2,
        s3_prefix="s3://test-public-bucket/20002/",
        https_prefix="http://localhost:4444/20002/",
    )

    DatasetFundingFactory(dataset=ds1, funding_agency_name="Grant For dataset1")
    DatasetFundingFactory(dataset=ds2, funding_agency_name="Grant For dataset2")

    DatasetAuthorFactory(dataset=ds1, name="Author 1", primary_author_status=True)
    DatasetAuthorFactory(
        dataset=ds1,
        name="Author 2",
        corresponding_author_status=True,
        orcid="0000-2222-9999-8888",
    )
    DatasetAuthorFactory(dataset=ds2, name="Author 3", primary_author_status=True)
    DatasetAuthorFactory(
        dataset=ds2,
        name="Author 4",
        corresponding_author_status=True,
        orcid="4444-2222-9999-8888",
    )

    r1 = RunFactory.create(
        dataset=ds1,
        name="RUN1",
        s3_prefix="s3://test-public-bucket/20001/RUN1/",
        https_prefix="http://localhost:4444/20001/RUN1/",
    )
    r2 = RunFactory.create(
        dataset=ds1,
        name="RUN2",
        s3_prefix="s3://test-public-bucket/20001/RUN2/",
        https_prefix="http://localhost:4444/20001/RUN2/",
    )
    r3 = RunFactory.create(
        dataset=ds2,
        name="RUN001",
        s3_prefix="s3://test-public-bucket/20002/RUN001/",
        https_prefix="http://localhost:4444/20002/RUN001/",
    )
    r4 = RunFactory.create(
        dataset=ds2,
        name="RUN002",
        s3_prefix="s3://test-public-bucket/20002/RUN002/",
        https_prefix="http://localhost:4444/20002/RUN002/",
    )

    ts1 = TiltseriesFactory.create(
        run=r1,
        deposition=dep1,
        s3_mrc_file="s3://test-public-bucket/20001/RUN1/TiltSeries/RUN1_bin1.mrc",
        s3_omezarr_dir="s3://test-public-bucket/20001/RUN1/TiltSeries/RUN1.zarr",
        https_mrc_file="http://localhost:4444/20001/RUN1/TiltSeries/RUN1_bin1.mrc",
        https_omezarr_dir="http://localhost:4444/20001/RUN1/TiltSeries/RUN1.zarr",
        s3_angle_list="s3://test-public-bucket/20001/RUN1/TiltSeries/RUN1.rawtlt",
        https_angle_list="http://localhost:4444/20001/RUN1/TiltSeries/RUN1.rawtlt",
    )
    ts2 = TiltseriesFactory.create(
        run=r2,
        deposition=dep1,
        s3_mrc_file="s3://test-public-bucket/20001/RUN2/TiltSeries/RUN2.mrc",
        s3_omezarr_dir="s3://test-public-bucket/20001/RUN2/TiltSeries/RUN2.zarr",
        https_mrc_file="http://localhost:4444/20001/RUN2/TiltSeries/RUN2.mrc",
        https_omezarr_dir="http://localhost:4444/20001/RUN2/TiltSeries/RUN2.zarr",
        s3_angle_list="s3://test-public-bucket/20001/RUN2/TiltSeries/RUN2.rawtlt",
        https_angle_list="http://localhost:4444/20001/RUN2/TiltSeries/RUN2.rawtlt",
    )
    ts3 = TiltseriesFactory.create(
        run=r3,
        deposition=dep2,
        s3_mrc_file="s3://test-public-bucket/20002/RUN001/TiltSeries/RUN001.mrc",
        s3_omezarr_dir="s3://test-public-bucket/20002/RUN001/TiltSeries/RUN001.zarr",
        https_mrc_file="http://localhost:4444/20002/RUN001/TiltSeries/RUN001.mrc",
        https_omezarr_dir="http://localhost:4444/20002/RUN001/TiltSeries/RUN001.zarr",
        s3_angle_list="s3://test-public-bucket/20002/RUN001/TiltSeries/RUN001.rawtlt",
        https_angle_list="http://localhost:4444/20002/RUN001/TiltSeries/RUN001.rawtlt",
    )
    ts4 = TiltseriesFactory.create(
        run=r4,
        deposition=dep2,
        s3_mrc_file="s3://test-public-bucket/20002/RUN002/TiltSeries/RUN002.mrc",
        s3_omezarr_dir="s3://test-public-bucket/20002/RUN002/TiltSeries/RUN002.zarr",
        https_mrc_file="http://localhost:4444/20002/RUN002/TiltSeries/RUN002.mrc",
        https_omezarr_dir="http://localhost:4444/20002/RUN002/TiltSeries/RUN002.zarr",
        s3_angle_list="s3://test-public-bucket/20002/RUN002/TiltSeries/RUN002.rawtlt",
        https_angle_list="http://localhost:4444/20002/RUN002/TiltSeries/RUN002.rawtlt",
    )

    al1 = AlignmentFactory.create(deposition=dep1, run=r1, tiltseries=ts1)
    al2 = AlignmentFactory.create(deposition=dep1, run=r2, tiltseries=ts2)
    al3 = AlignmentFactory.create(deposition=dep1, run=r3, tiltseries=ts3)
    al4 = AlignmentFactory.create(deposition=dep1, run=r4, tiltseries=ts4)

    tvs4 = TomogramVoxelSpacingFactory.create(
        run=r1,
        voxel_spacing=13.48,
        s3_prefix="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/",
        https_prefix="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/",
    )
    tvs5 = TomogramVoxelSpacingFactory.create(
        run=r2,
        voxel_spacing=7.56,
        s3_prefix="s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/",
        https_prefix="http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/",
    )
    tvs6 = TomogramVoxelSpacingFactory.create(
        run=r3,
        voxel_spacing=7.56,
        s3_prefix="s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/",
        https_prefix="http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/",
    )
    tvs7 = TomogramVoxelSpacingFactory.create(
        run=r4,
        voxel_spacing=13.48,
        s3_prefix="s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/",
        https_prefix="http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/",
    )

    a40 = AnnotationFactory.create(
        run=r1,
        deposition=None,  # Explicitly testing empty deposition_id!
        s3_metadata_path="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/author1-mitochondria-1.0.json",
        https_metadata_path="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/author1-mitochondria-1.0.json",
        deposition_date="2023-04-01",
        release_date="2023-06-01",
        annotation_publication="EMPIAR-77777",
        annotation_method="Manual",
        is_curator_recommended=True,
        object_name="Test Annotation Object Name",
        object_id="GO:0000000",
    )
    a41 = AnnotationFactory.create(
        run=r1,
        deposition=dep1,
        s3_metadata_path="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/author1-ribosome-1.0.json",
        https_metadata_path="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/author1-ribosome-1.0.json",
        deposition_date="2023-04-01",
        release_date="2023-06-01",
        annotation_publication="EMPIAR-77777",
        annotation_method="Manual",
        is_curator_recommended=True,
        object_name="Ribosome",
        object_id="GO:000000A",
    )

    a42 = AnnotationFactory.create(
        run=r2,
        deposition=dep1,
        s3_metadata_path="s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/author2-ribosome-1.0.json",
        https_metadata_path="http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/author2-ribosome-1.0.json",
        deposition_date="2023-04-01",
        release_date="2023-06-01",
        annotation_publication="EMPIAR-77777",
        annotation_method="Manual",
        is_curator_recommended=True,
        object_name="Ribosome",
        object_id="GO:000000A",
    )
    a43 = AnnotationFactory.create(
        run=r3,
        deposition=dep2,
        s3_metadata_path="s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/Annotations/author3-ribosome-1.0.json",
        https_metadata_path="http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/Annotations/author3-ribosome-1.0.json",
        deposition_date="2023-04-01",
        release_date="2023-06-01",
        annotation_publication="EMPIAR-77777",
        annotation_method="Manual",
        is_curator_recommended=True,
        object_name="Ribosome",
        object_id="GO:000000A",
    )
    a44 = AnnotationFactory.create(
        run=r4,
        deposition=dep2,
        s3_metadata_path="s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/author4-ribosome-1.0.json",
        https_metadata_path="http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/author4-ribosome-1.0.json",
        deposition_date="2023-04-01",
        release_date="2023-06-01",
        annotation_publication="EMPIAR-77777",
        annotation_method="Manual",
        is_curator_recommended=True,
        object_name="Ribosome",
        object_id="GO:000000A",
    )
    a45 = AnnotationFactory.create(
        run=r4,
        deposition=dep2,
        s3_metadata_path="s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/author4-spike-1.0.json",
        https_metadata_path="http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/author4-spike-1.0.json",
        deposition_date="2023-04-01",
        release_date="2023-06-01",
        annotation_publication="EMPIAR-77777",
        annotation_method="Manual",
        is_curator_recommended=True,
        object_name="Spike Protein",
        object_id="GO:000000A",
    )

    AnnotationAuthorFactory.create(
        annotation=a40,
        name="Author 1",
        orcid="0000-0000-0000-0007",
    )
    AnnotationAuthorFactory.create(
        annotation=a40,
        name="Author 2",
        orcid="0000-0000-0000-0008",
    )
    AnnotationAuthorFactory.create(
        annotation=a41,
        name="Author 1",
        orcid="0000-0000-0000-0007",
    )
    AnnotationAuthorFactory.create(
        annotation=a41,
        name="Author 2",
        orcid="0000-0000-0000-0008",
    )
    AnnotationAuthorFactory.create(
        annotation=a42,
        name="Author 3",
        orcid="0000-0000-0000-0039",
    )
    AnnotationAuthorFactory.create(
        annotation=a42,
        name="Author 4",
        orcid="0000-0000-0000-0049",
    )
    AnnotationAuthorFactory.create(
        annotation=a43,
        name="Author 5",
        orcid="0000-0000-0000-0059",
    )
    AnnotationAuthorFactory.create(
        annotation=a44,
        name="Author 6",
        orcid="0000-0000-0000-0069",
    )
    AnnotationAuthorFactory.create(
        annotation=a45,
        name="Author 7",
        orcid="0000-0000-0000-0079",
    )
    AnnotationAuthorFactory.create(
        annotation=a45,
        name="Author 8",
        orcid="0000-0000-0000-0089",
    )

    as40op = AnnotationShapeFactory.create(annotation=a40, shape_type="OrientedPoint")
    as40sm = AnnotationShapeFactory.create(
        annotation=a40,
        shape_type="SegmentationMask",
    )
    as41pt = AnnotationShapeFactory.create(annotation=a41, shape_type="Point")
    as41sm = AnnotationShapeFactory.create(
        annotation=a41,
        shape_type="SegmentationMask",
    )
    as42op = AnnotationShapeFactory.create(annotation=a42, shape_type="OrientedPoint")
    as42sm = AnnotationShapeFactory.create(
        annotation=a42,
        shape_type="SegmentationMask",
    )
    as43op = AnnotationShapeFactory.create(annotation=a43, shape_type="OrientedPoint")
    as44sm = AnnotationShapeFactory.create(
        annotation=a44,
        shape_type="SegmentationMask",
    )
    as45pt = AnnotationShapeFactory.create(annotation=a45, shape_type="Point")

    AnnotationFileFactory.create(
        annotation_shape=as40op,
        alignment=al1,
        tomogram_voxel_spacing=tvs4,
        format="ndjson",
        https_path="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.ndjson",
        s3_path="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.ndjson",
    )
    AnnotationFileFactory.create(
        annotation_shape=as40sm,
        alignment=al1,
        tomogram_voxel_spacing=tvs4,
        format="mrc",
        https_path="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.mrc",
        s3_path="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.mrc",
    )
    AnnotationFileFactory.create(
        annotation_shape=as40sm,
        alignment=al1,
        tomogram_voxel_spacing=tvs4,
        format="zarr",
        https_path="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.zarr",
        s3_path="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/mitochondria.zarr",
    )

    AnnotationFileFactory.create(
        annotation_shape=as41pt,
        alignment=al1,
        tomogram_voxel_spacing=tvs4,
        format="ndjson",
        https_path="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.ndjson",
        s3_path="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.ndjson",
    )
    AnnotationFileFactory.create(
        annotation_shape=as41sm,
        alignment=al1,
        tomogram_voxel_spacing=tvs4,
        format="mrc",
        https_path="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.mrc",
        s3_path="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.mrc",
    )
    AnnotationFileFactory.create(
        annotation_shape=as41sm,
        alignment=al1,
        tomogram_voxel_spacing=tvs4,
        format="zarr",
        https_path="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.zarr",
        s3_path="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/Annotations/ribosome.zarr",
    )

    AnnotationFileFactory.create(
        annotation_shape=as42op,
        alignment=al2,
        tomogram_voxel_spacing=tvs5,
        format="ndjson",
        https_path="http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.ndjson",
        s3_path="s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.ndjson",
    )
    AnnotationFileFactory.create(
        annotation_shape=as42sm,
        alignment=al2,
        tomogram_voxel_spacing=tvs5,
        format="mrc",
        https_path="http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.mrc",
        s3_path="s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.mrc",
    )
    AnnotationFileFactory.create(
        annotation_shape=as42sm,
        alignment=al2,
        tomogram_voxel_spacing=tvs5,
        format="zarr",
        https_path="http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.zarr",
        s3_path="s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/Annotations/ribosome.zarr",
    )

    AnnotationFileFactory.create(
        annotation_shape=as43op,
        alignment=al3,
        tomogram_voxel_spacing=tvs6,
        format="ndjson",
        https_path="http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/Annotations/ribosome.ndjson",
        s3_path="s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing13.48/Annotations/ribosome.ndjson",
    )

    AnnotationFileFactory.create(
        annotation_shape=as44sm,
        alignment=al4,
        tomogram_voxel_spacing=tvs7,
        format="zarr",
        https_path="http://localhost:4444/20002/RUN002/TomogramVoxelSpacing7.56/Annotations/ribosome.zarr",
        s3_path="s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/ribosome.zarr",
    )
    AnnotationFileFactory.create(
        annotation_shape=as44sm,
        alignment=al4,
        tomogram_voxel_spacing=tvs7,
        format="mrc",
        https_path="http://localhost:4444/20002/RUN002/TomogramVoxelSpacing7.56/Annotations/ribosome.mrc",
        s3_path="s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/ribosome.mrc",
    )

    AnnotationFileFactory.create(
        annotation_shape=as45pt,
        alignment=al4,
        tomogram_voxel_spacing=tvs7,
        format="ndjson",
        https_path="http://localhost:4444/20002/RUN002/TomogramVoxelSpacing7.56/Annotations/ribosome.json",
        s3_path="s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/Annotations/ribosome.json",
    )

    tomo1 = TomogramFactory.create(
        name="RUN1",
        run=r1,
        alignment=al1,
        tomogram_voxel_spacing=tvs4,
        deposition=dep1,
        s3_omezarr_dir="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN1.zarr",
        https_omezarr_dir="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN1.zarr",
        s3_mrc_file="s3://test-public-bucket/20001/RUN1/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN1.mrc",
        https_mrc_file="http://localhost:4444/20001/RUN1/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN1.mrc",
    )
    tomo2 = TomogramFactory.create(
        name="RUN2",
        run=r2,
        alignment=al2,
        tomogram_voxel_spacing=tvs5,
        deposition=dep1,
        s3_omezarr_dir="s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN2.zarr",
        https_omezarr_dir="http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN2.zarr",
        s3_mrc_file="s3://test-public-bucket/20001/RUN2/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN2.mrc",
        https_mrc_file="http://localhost:4444/20001/RUN2/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN2.mrc",
    )
    tomo3 = TomogramFactory.create(
        name="RUN001",
        run=r3,
        alignment=al3,
        tomogram_voxel_spacing=tvs6,
        deposition=dep2,
        s3_omezarr_dir="s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN001.zarr",
        https_omezarr_dir="http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN001.zarr",
        s3_mrc_file="s3://test-public-bucket/20002/RUN001/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN001.mrc",
        https_mrc_file="http://localhost:4444/20002/RUN001/TomogramVoxelSpacing7.56/CanonicalTomogram/RUN001.mrc",
    )
    tomo4 = TomogramFactory.create(
        name="RUN002",
        run=r4,
        alignment=al4,
        tomogram_voxel_spacing=tvs7,
        deposition=dep2,
        s3_omezarr_dir="s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN002.zarr",
        https_omezarr_dir="http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN002.zarr",
        s3_mrc_file="s3://test-public-bucket/20002/RUN002/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN002.mrc",
        https_mrc_file="http://localhost:4444/20002/RUN002/TomogramVoxelSpacing13.48/CanonicalTomogram/RUN002.mrc",
    )

    TomogramAuthorFactory.create(tomogram=tomo1, author_list_order=1)
    TomogramAuthorFactory.create(tomogram=tomo1, author_list_order=2)
    TomogramAuthorFactory.create(tomogram=tomo2, author_list_order=1)
    TomogramAuthorFactory.create(tomogram=tomo2, author_list_order=2)
    TomogramAuthorFactory.create(tomogram=tomo3, author_list_order=1)
    TomogramAuthorFactory.create(tomogram=tomo3, author_list_order=2)
    TomogramAuthorFactory.create(tomogram=tomo4, author_list_order=1)
    TomogramAuthorFactory.create(tomogram=tomo4, author_list_order=2)

    FileFactory.update_file_ids()

    session.commit()


if __name__ == "__main__":
    print("Seeding database")  # noqa
    use_factoryboy()
    print("Seeding complete")  # noqa
