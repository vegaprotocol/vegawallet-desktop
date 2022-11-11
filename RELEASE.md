# Release

## Process

A default version is hard-coded. This is done for people that use the development toolchain to install the wallet (i.e. `wails build`).

This requires additional steps during the release process.

1. Set the `Version` variable to the desired version in the `backend/version.go` file.
2. Set the `productVersion` properties to the desired version in the `wails.json`.
3. Set the `version` property to the desired version in the `frontend/package.json`.
4. Clean up the changelog:
   * Remove the `Unreleased` prefix in the title
   * Remove empty sections
   * Remove empty links
5. Commit the change.
6. Create a branch `release/vx.y.z` where `x.y.z` is the semantic version of the software.
7. Merge it in the `main` branch.
8. Tag the commit with the exact same name set on `defaultVersion`, and push it.
9. Wait for the release job to publish the released software.
10. Once everything is published, merge the `main` branch to the `develop` one.
11. Push a new commit to prepare the project for the next release:
    * Set the version to the next development version. A development version is suffixed by `+dev`.
    * Add the `Unreleased` section to the changelog.

### Example on stable release

For example, let's say we are releasing the version `v0.9.0`:

* The `defaultVersion`should be set to `v0.9.0`.
* The tag should be `v0.9.0`.
* The next development version should be `v0.10.0+dev`.

### Example on pre-release

For pre-release, let's say we are pre-releasing the version `v0.9.0-pre1`:

* The `defaultVersion`should be set to `v0.9.0-pre1`.
* The tag should be `v0.9.0-pre1`.
* The next development version should be `v0.9.0-pre2+dev`.



