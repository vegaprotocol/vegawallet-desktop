# Release

## Process

A default version is hard-coded. This is done for people that use the development toolchain to install the wallet (i.e. `wails build`).

This requires additional steps during the release process.

1. Set the `defaultVersion` variable to the desired version in the `backend/version.go` file.
2. Set the `productVersion` properties to the desired version in the `wails.json`.
3. Set the `version` property to the desired version in the `frontend/package.json`.
4. Commit the change right before the tagging.
5. Tag and release with the exact same name set on `defaultVersion` variable.
6. Right after the release, push a new commit to set the version to a next
   development version. A development version is suffixed by `+dev`.

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



